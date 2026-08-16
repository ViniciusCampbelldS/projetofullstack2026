import { EpiService } from '../epi-status/epi-status';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacaoService, EpiMonitorado } from '../../../service/notificacao';
import type { Epi } from '../epi.models';
import { AuthService } from '../../../service/auth';

type StatusClass = 'status-expired' | 'status-warning' | 'status-good';

interface BuscaEpiForm {
	nome: string;
	ca: string;
	lote: string;
	validade: string;
	quantidade: number;
	funcionario: string;
	situacao: string;
}

interface BuscaEpiEditForm {
	nome: string;
	ca: string;
	lote: string;
	validade: string;
	quantidade: number;
	funcionario: string;
	substituido: boolean;
}

interface BuscaEpiRow {
	id: number;
	funcionario: string;
	nome: string;
	ca: string;
	vencimento: string;
	lote?: string;
	quantidade?: number;
	substituido?: boolean;
	diasAvisoEpi: number;
	status: string;
	statusClass: StatusClass;
}

@Component({
	selector: 'app-busca-epi',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './busca-epi.html',
	styleUrl: './busca-epi.scss'
})
export class BuscaEpi implements OnInit {
	private readonly diasAvisoPadrao = 30;

	private epiService = inject(EpiService);
	private notificacaoService = inject(NotificacaoService);
	private authService = inject(AuthService);

	epis: BuscaEpiRow[] = [];
	resultados: BuscaEpiRow[] = [];
	exportMessage = '';
	modalDescarteAberto = false;
	modalEdicaoAberto = false;
	itemSelecionado: BuscaEpiRow | null = null;
	itemEditando: BuscaEpiRow | null = null;
	motivoDescarte = '';
	quantidadeDescarte = 1;
	diasAvisoEdicao = this.diasAvisoPadrao;
	form: BuscaEpiForm = this.criarFormVazio();
	editForm: BuscaEpiEditForm = this.criarEditFormVazio();

	get podeEditar(): boolean {
		return this.authService.podeEditarEpi();
	}

	get perfilAtual(): string {
		return this.authService.obterPerfil();
	}

	get podeSalvar(): boolean {
		return Boolean(
			this.form.nome.trim() &&
			this.form.ca.trim() &&
			this.form.lote.trim() &&
			this.form.validade &&
			this.form.quantidade > 0
		);
	}

	ngOnInit(): void {
		this.carregarFallbackLocal();

		this.epiService.listar().subscribe({
			next: (epis) => {
				const lista = this.extrairListaEpis(epis);

				if (lista.length === 0) {
					return;
				}

				this.epis = lista.map((epi) => this.mapearEpiParaLinha(epi));
				this.recalcularStatuses();
				this.aplicarFiltros();
			},
			error: () => {},
		});
	}

	exportarRelatorio(formato: 'pdf' | 'odf' | 'xlsx' | 'xml'): void {
		const linhas = this.resultados.map((item) => ({
			funcionario: item.funcionario,
			epi: item.nome,
			ca: item.ca,
			vencimento: item.vencimento,
			status: item.status,
		}));

		const conteudo = formato === 'xml'
			? this.gerarXml(linhas)
			: this.gerarTextoRelatorio(linhas, formato);

		const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = `relatorio-epis.${formato}`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);

		this.exportMessage = `Relatório .${formato} gerado localmente.`;
	}

	salvarEpi(): void {
		if (!this.podeEditar) {
			this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para cadastrar EPIs.`;
			return;
		}

		if (!this.podeSalvar) {
			this.exportMessage = 'Preencha todos os campos obrigatórios antes de salvar.';
			return;
		}

		const novoEpiBase: BuscaEpiRow = {
			id: Math.max(...this.epis.map((item) => item.id), 0) + 1,
			funcionario: 'Não vinculado',
			nome: this.form.nome.trim(),
			ca: this.form.ca.trim(),
			lote: this.form.lote.trim(),
			vencimento: this.formatarData(this.toDate(this.form.validade)),
			quantidade: this.form.quantidade,
			substituido: false,
			diasAvisoEpi: this.diasAvisoPadrao,
			status: 'Distante do vencimento',
			statusClass: 'status-good',
		};

		const novoEpi = this.atualizarStatusDoItem(novoEpiBase);

		this.epis = [novoEpi, ...this.epis];
		this.limparCadastro();
		this.aplicarFiltros();
		this.exportMessage = 'EPI cadastrado localmente no frontend.';
	}

	limpar(): void {
		this.form = this.criarFormVazio();
		this.resultados = [...this.epis];
		this.exportMessage = '';
	}

	aplicarFiltros(): void {
		const nomeFiltro = this.normalizarTexto(this.form.nome);
		const caFiltro = this.normalizarTexto(this.form.ca);
		const validadeFiltro = this.normalizarTexto(this.form.validade);
		const funcionarioFiltro = this.normalizarTexto(this.form.funcionario);
		const situacaoFiltro = this.normalizarTexto(this.form.situacao);

		this.resultados = this.epis.filter((item) => {
			const nome = this.normalizarTexto(item.nome);
			const ca = this.normalizarTexto(item.ca);
			const vencimento = this.normalizarTexto(item.vencimento);
			const funcionario = this.normalizarTexto(item.funcionario);
			const situacao = this.normalizarTexto(item.status);

			return (
				(!nomeFiltro || nome.includes(nomeFiltro)) &&
				(!caFiltro || ca.includes(caFiltro)) &&
				(!validadeFiltro || vencimento.includes(validadeFiltro)) &&
				(!funcionarioFiltro || funcionario.includes(funcionarioFiltro)) &&
				(!situacaoFiltro || situacao.includes(situacaoFiltro))
			);
		});
	}

	abrirEdicao(item: BuscaEpiRow): void {
		if (!this.podeEditar) {
			this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para editar EPIs.`;
			return;
		}

		this.itemEditando = item;
		this.diasAvisoEdicao = item.diasAvisoEpi;
		this.editForm = {
			nome: item.nome,
			ca: item.ca,
			lote: item.lote ?? '',
			validade: this.dataParaInput(item.vencimento),
			quantidade: item.quantidade ?? 1,
			funcionario: item.funcionario,
			substituido: item.substituido ?? false,
		};
		this.modalEdicaoAberto = true;
	}

	salvarEdicao(): void {
		if (!this.itemEditando) {
			return;
		}

		if (this.diasAvisoEdicao < 0) {
			this.exportMessage = 'Os dias de aviso por CA devem ser maiores ou iguais a zero.';
			return;
		}

		if (
			!this.editForm.nome.trim() ||
			!this.editForm.ca.trim() ||
			!this.editForm.lote.trim() ||
			!this.editForm.validade ||
			this.editForm.quantidade < 1 ||
			!this.editForm.funcionario.trim()
		) {
			this.exportMessage = 'Preencha todos os campos do EPI antes de salvar a edição.';
			return;
		}

		this.epis = this.epis.map((item) =>
			item.id === this.itemEditando?.id
				? this.atualizarStatusDoItem({
					...item,
					nome: this.editForm.nome.trim(),
					ca: this.editForm.ca.trim(),
					lote: this.editForm.lote.trim(),
					vencimento: this.formatarData(this.toDate(this.editForm.validade)),
					quantidade: this.editForm.quantidade,
					funcionario: this.editForm.funcionario.trim(),
					substituido: this.editForm.substituido,
					diasAvisoEpi: this.diasAvisoEdicao,
				})
				: item
		);

		this.aplicarFiltros();
		this.exportMessage = `EPI ${this.editForm.nome} atualizado localmente no frontend.`;
		this.fecharModais();
	}

	abrirDescarte(item: BuscaEpiRow): void {
		if (!this.podeEditar) {
			this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para descarte.`;
			return;
		}

		this.itemSelecionado = item;
		this.motivoDescarte = '';
		this.quantidadeDescarte = 1;
		this.modalDescarteAberto = true;
	}

	confirmarDescarte(): void {
		if (!this.itemSelecionado) {
			return;
		}

		if (this.quantidadeDescarte < 1) {
			this.exportMessage = 'Informe uma quantidade válida para exclusão.';
			return;
		}

		this.epis = this.epis.filter((item) => item.id !== this.itemSelecionado?.id);
		this.aplicarFiltros();
		this.exportMessage = `Exclusão local registrada para ${this.quantidadeDescarte} unidade(s)${this.motivoDescarte ? ': ' + this.motivoDescarte : '.'}`;
		this.fecharModais();
	}

	fecharModais(): void {
		this.modalDescarteAberto = false;
		this.modalEdicaoAberto = false;
		this.itemSelecionado = null;
		this.itemEditando = null;
		this.quantidadeDescarte = 1;
		this.editForm = this.criarEditFormVazio();
	}

	private recalcularStatuses(): void {
		this.epis = this.epis.map((item) => this.atualizarStatusDoItem(item));
	}

	private atualizarStatusDoItem(item: BuscaEpiRow): BuscaEpiRow {
		const statusInfo = this.calcularStatus(this.toDate(item.vencimento), item.diasAvisoEpi);

		return {
			...item,
			status: statusInfo.status,
			statusClass: statusInfo.statusClass,
		};
	}

	private statusClassPorTexto(status: string): StatusClass {
		if (status === 'Vencido' || status === 'Danificado') {
			return 'status-expired';
		}

		if (status === 'Atenção' || status === 'Próximo do vencimento') {
			return 'status-warning';
		}

		return 'status-good';
	}

	private gerarTextoRelatorio(linhas: Array<Record<string, string>>, formato: string): string {
		return [
			`Relatório de EPIs (${formato.toUpperCase()})`,
			`Gerado em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`,
			'',
			...linhas.map((linha, index) =>
				`${index + 1}. ${linha['funcionario']} | ${linha['epi']} | ${linha['ca']} | ${linha['vencimento']} | ${linha['status']}`
			),
		].join('\n');
	}

	private gerarXml(linhas: Array<Record<string, string>>): string {
		const itens = linhas.map((linha) => `
  <epi>
    <funcionario>${this.escapeXml(linha['funcionario'])}</funcionario>
    <nome>${this.escapeXml(linha['epi'])}</nome>
    <ca>${this.escapeXml(linha['ca'])}</ca>
    <vencimento>${this.escapeXml(linha['vencimento'])}</vencimento>
    <status>${this.escapeXml(linha['status'])}</status>
  </epi>`).join('');

		return `<?xml version="1.0" encoding="UTF-8"?>\n<relatorio>${itens}\n</relatorio>`;
	}

	private escapeXml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}

	private extrairListaEpis(epis: unknown): Epi[] {
		if (Array.isArray(epis)) {
			return epis as Epi[];
		}

		const episComValue = epis as { value?: unknown } | null;

		if (Array.isArray(episComValue?.value)) {
			return episComValue.value as Epi[];
		}

		return [];
	}

	private carregarFallbackLocal(): void {
		const episLocais = this.notificacaoService.todosEpis;
		this.epis = episLocais.map((epi) => this.mapearMonitoradoParaLinha(epi));
		this.recalcularStatuses();
		this.aplicarFiltros();
	}

	private mapearMonitoradoParaLinha(epi: EpiMonitorado): BuscaEpiRow {
		return this.atualizarStatusDoItem({
			id: epi.id,
			funcionario: epi.funcionario,
			nome: epi.nome,
			ca: epi.ca,
			vencimento: this.formatarData(this.toDate(epi.vencimento)),
			substituido: false,
			diasAvisoEpi: this.obterDiasAvisoInicial(epi.ca),
			status: 'Distante do vencimento',
			statusClass: 'status-good',
		});
	}

	private mapearEpiParaLinha(epi: Epi): BuscaEpiRow {
		return this.atualizarStatusDoItem({
			id: epi.id,
			funcionario: epi.funcionario,
			nome: epi.nome,
			ca: epi.ca,
			vencimento: this.formatarData(this.toDate(epi.vencimento)),
			substituido: false,
			diasAvisoEpi: this.obterDiasAvisoInicial(epi.ca),
			status: 'Distante do vencimento',
			statusClass: 'status-good',
		});
	}

	private toDate(value: Date | string | null): Date | null {
		if (value instanceof Date) {
			return Number.isNaN(value.getTime()) ? null : value;
		}

		if (typeof value === 'string' && value.trim()) {
			const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
			if (isoMatch) {
				const [, year, month, day] = isoMatch;
				const parsed = new Date(Number(year), Number(month) - 1, Number(day));
				return Number.isNaN(parsed.getTime()) ? null : parsed;
			}

			const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
			if (brMatch) {
				const [, day, month, year] = brMatch;
				const parsed = new Date(Number(year), Number(month) - 1, Number(day));
				return Number.isNaN(parsed.getTime()) ? null : parsed;
			}

			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? null : parsed;
		}

		return null;
	}

	private formatarData(value: Date | null): string {
		if (!value) {
			return '-';
		}

		return new Intl.DateTimeFormat('pt-BR').format(value);
	}

	private calcularStatus(vencimento: Date | null, diasAvisoEpi = this.diasAvisoPadrao): { status: string; statusClass: StatusClass } {
		if (!vencimento) {
			return {
				status: 'Distante do vencimento',
				statusClass: 'status-good',
			};
		}

		const diasRestantes = this.notificacaoService.calcularDiasRestantes(vencimento);

		if (diasRestantes === null) {
			return {
				status: 'Distante do vencimento',
				statusClass: 'status-good',
			};
		}

		if (diasRestantes < 0) {
			return {
				status: 'Vencido',
				statusClass: 'status-expired',
			};
		}

		if (diasRestantes <= diasAvisoEpi) {
			return {
				status: 'Próximo do vencimento',
				statusClass: 'status-warning',
			};
		}

		return {
			status: 'Distante do vencimento',
			statusClass: 'status-good',
		};
	}

	private criarFormVazio(): BuscaEpiForm {
		return {
			nome: '',
			ca: '',
			lote: '',
			validade: '',
			quantidade: 1,
			funcionario: '',
			situacao: '',
		};
	}

	private criarEditFormVazio(): BuscaEpiEditForm {
		return {
			nome: '',
			ca: '',
			lote: '',
			validade: '',
			quantidade: 1,
			funcionario: '',
			substituido: false,
		};
	}

	private obterDiasAvisoInicial(ca: string): number {
		return ca === '34456' ? 120 : this.diasAvisoPadrao;
	}

	private dataParaInput(valor: string): string {
		const data = this.toDate(valor);

		if (!data) {
			return '';
		}

		const ano = data.getFullYear();
		const mes = String(data.getMonth() + 1).padStart(2, '0');
		const dia = String(data.getDate()).padStart(2, '0');

		return `${ano}-${mes}-${dia}`;
	}

	private limparCadastro(): void {
		this.form = {
			...this.form,
			nome: '',
			ca: '',
			lote: '',
			validade: '',
			quantidade: 1,
		};
	}

	private normalizarTexto(value: string | undefined): string {
		return (value ?? '').trim().toLocaleLowerCase('pt-BR');
	}
}
