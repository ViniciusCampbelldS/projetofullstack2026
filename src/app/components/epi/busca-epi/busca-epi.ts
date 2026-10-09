import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// EpiRequest é usado para cadastrar um único EPI.
// EpiCreateRequest fica reservado para cadastro em lote.
// Importa os modelos utilizados no cadastro individual/em lote e na edição.
import { EpiCreateRequest, EpiRequest, EpiResponse, EpiUpdateRequest } from '../../../models/epi';
import { EpiService } from '../../..//services/epi.service';
import { Component, OnInit, effect, inject } from '@angular/core';
import { NotificacaoService, EpiMonitorado } from '../../../services/notificacao';
import { AuthService } from '../../../services/auth/auth';

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
  substituido: boolean;
}

interface BuscaEpiRow {
  id: number;
  funcionario: string;
  // IDs preservados para o PUT.
  funcionarioIds?: number[];
  nome: string;
  ca: string;
  // Data de vencimento formatada.
  vencimento: string;
  lote?: string;
  substituido?: boolean;
  // Situação calculada de vencimento, como "Vencido", "Próximo do vencimento" ou "Distante do vencimento".
  status: string;
  // Classe visual.
  statusClass: StatusClass;
}

@Component({
  selector: 'app-busca-epi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-epi.html',
  styleUrl: './busca-epi.scss',
})
export class BuscaEpi implements OnInit {
  private readonly epiService = inject(EpiService);
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
  incluirSubstituidos = false;
  form: BuscaEpiForm = this.criarFormVazio();
  editForm: BuscaEpiEditForm = this.criarEditFormVazio();
  epiEditandoId: number | null = null;
  mensagem = '';
  erro = '';
  private readonly observarRegrasAviso = effect(() => {
    this.notificacaoService.regrasAviso();
    this.recalcularStatuses();
    this.aplicarFiltros();
  });

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
      Number.isInteger(this.form.quantidade) &&
      this.form.quantidade > 0,
    );
  }

  carregarEpis(): void {
    this.epiService.listar().subscribe({
      next: (epis) => {
        this.epis = this.extrairListaEpis(epis).map((epi) => this.mapearEpiParaLinha(epi));
        this.recalcularStatuses();
        this.aplicarFiltros();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os epis.';
      },
    });
  }

  ngOnInit(): void {
    this.carregarFallbackLocal();
    this.carregarEpis();
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

  /*
   * Cadastra um ou mais EPIs usando a API Java.
   *
   * O formulário possui um campo de quantidade.
   * Por isso, utiliza POST /epis/bulk.
   *
   * A data do HTML chega em yyyy-MM-dd e é enviada
   * diretamente no campo vencimento, esperado pelo Java.
   */
  salvarEpi(): void {
    // Verifica se o usuário pode cadastrar EPIs.
    if (!this.podeEditar) {
      this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para cadastrar EPIs.`;
      return;
    }

    // Verifica os campos obrigatórios.
    if (!this.podeSalvar) {
      this.exportMessage = 'Preencha todos os campos obrigatórios antes de salvar.';
      return;
    }

    /*
     * Monta os dados de um único EPI.
     *
     * Atenção:
     * Monta o payload correspondente ao POST /epis.
     */
    const epiBase: EpiRequest = {
      nome: this.form.nome.trim(),
      ca: this.form.ca.trim(),
      lote: this.form.lote.trim(),
      // O input type="date" fornece yyyy-MM-dd.
      // Não converter para dd/MM/yyyy.
      vencimento: this.form.validade,
      // Um EPI recém-cadastrado não está substituído.
      substituido: false,
      // Cadastra inicialmente sem vincular funcionários.
      funcionarioIds: [],
    };

    /*
     * Gera a quantidade de registros solicitada.
     *
     * No modelo atual, cada unidade criada será um registro
     * independente na tabela epis.
     */
    const payload: EpiCreateRequest = {
      epis: Array.from(
        { length: this.form.quantidade },
        () => ({
          ...epiBase,
          // Cada registro recebe sua própria lista de IDs.
          funcionarioIds: [...epiBase.funcionarioIds],
        })
      ),
    };

    // Envia os registros para POST /epis/bulk.
    this.epiService.cadastrarEmLote(payload).subscribe({
      // Executado quando o cadastro for concluído.
      next: (response) => {// A resposta em lote contém a propriedade "items".
        // Cada item é um EpiResponse individual.
        const novosEpis =
          response.items.map(
            (epi) => this.mapearEpiParaLinha(epi)
          );

        // Insere os novos registros no início da lista.
        this.epis = [
          ...novosEpis,
          ...this.epis,
        ];

        // Recalcula os status de vencimento.
        this.recalcularStatuses();

        // Atualiza os resultados exibidos.
        this.aplicarFiltros();

        // Limpa o formulário após o sucesso.
        this.limparCadastro();

        // Informa quantos registros foram criados.
        this.exportMessage =
          `${response.items.length} EPI(s) cadastrado(s) com sucesso.`;
      },

				// Executado quando o backend rejeita a requisição.
				error: (erro) => {

					// Exibe os detalhes para facilitar o diagnóstico.
					console.error(
						'Erro ao cadastrar EPI:',
						erro
					);

					// Usa a mensagem retornada pela API quando disponível.
					this.exportMessage =
						erro?.error?.detail ??
						erro?.error?.message ??
						'Não foi possível cadastrar o EPI. Verifique os dados e a data de validade.';
				},
			});
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
        (!situacaoFiltro || situacao.includes(situacaoFiltro)) &&
        (this.incluirSubstituidos || item.substituido === false)
      );
    });
  }

  abrirEdicao(item: BuscaEpiRow): void {
    if (!this.podeEditar) {
      this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para editar EPIs.`;
      return;
    }

    this.itemEditando = item;
    this.editForm = {
      nome: item.nome,
      ca: item.ca,
      lote: item.lote ?? '',
      validade: this.dataParaInput(item.vencimento),
      substituido: item.substituido ?? false,
    };
    this.modalEdicaoAberto = true;
  }

  salvarEdicao(): void {
    if (!this.itemEditando) {
      return;
    }

    if (
      !this.editForm.nome.trim() ||
      !this.editForm.ca.trim() ||
      !this.editForm.lote.trim() ||
      !this.editForm.validade
    ) {
      this.exportMessage = 'Preencha todos os campos do EPI antes de salvar a edição.';
      return;
    }

    // Monta o objeto completo (todos os campos) exigido pelo PUT /epis/{id}.
    const payload: EpiUpdateRequest = {
      nome: this.editForm.nome.trim(),
      ca: this.editForm.ca.trim(),
      lote: this.editForm.lote.trim(),
      // O backend Java utiliza "vencimento", não validade.
      vencimento: this.editForm.validade,
      // Mantém a situação de substituição.
      substituido: this.editForm.substituido,
      // Preserva os funcionários que já estavam vinculados.
      funcionarioIds: this.itemEditando.funcionarioIds ?? [],
    };

    this.epiService.atualizar(this.itemEditando.id, payload).subscribe({
      next: (epi) => {
        this.epis = this.epis.map((item) =>
          item.id === epi.id ? this.mapearEpiParaLinha(epi) : item,
        );
        this.recalcularStatuses();
        this.aplicarFiltros();
        this.exportMessage = `EPI ${epi.nome} atualizado com sucesso.`;
        this.fecharModais();
      },
      error: () => {
        this.exportMessage = 'Não foi possível atualizar o EPI.';
      },
    });
  }

  abrirDescarte(item: BuscaEpiRow): void {
    if (!this.podeEditar) {
      this.exportMessage = `Perfil ${this.perfilAtual} não possui permissão para descarte.`;
      return;
    }

    this.itemSelecionado = item;
    this.motivoDescarte = '';
    this.modalDescarteAberto = true;
  }

  confirmarDescarte(): void {
    if (!this.itemSelecionado) {
      return;
    }

    const item = this.itemSelecionado;
    this.epiService.excluir(item.id).subscribe({
      next: () => {
        this.epis = this.epis.filter((epi) => epi.id !== item.id);
        this.aplicarFiltros();
        this.exportMessage = `EPI ${item.nome} excluído com sucesso${this.motivoDescarte ? ': ' + this.motivoDescarte : '.'}`;
        this.fecharModais();
      },
      error: () => {
        this.exportMessage = 'Não foi possível excluir o EPI.';
      },
    });
  }

  fecharModais(): void {
    this.modalDescarteAberto = false;
    this.modalEdicaoAberto = false;
    this.itemSelecionado = null;
    this.itemEditando = null;
    this.editForm = this.criarEditFormVazio();
  }

  private recalcularStatuses(): void {
    this.epis = this.epis.map((item) => this.atualizarStatusDoItem(item));
  }

  private atualizarStatusDoItem(item: BuscaEpiRow): BuscaEpiRow {
    const statusInfo = this.calcularStatus(
      this.toDate(item.vencimento),
      this.notificacaoService.obterDiasAviso(item.ca, false),
    );

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
      ...linhas.map(
        (linha, index) =>
          `${index + 1}. ${linha['funcionario']} | ${linha['epi']} | ${linha['ca']} | ${linha['vencimento']} | ${linha['status']}`,
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

  private extrairListaEpis(epis: unknown): EpiResponse[] {
    if (Array.isArray(epis)) {
      return epis as EpiResponse[];
    }

    const episComValue = epis as { value?: unknown } | null;

    if (Array.isArray(episComValue?.value)) {
      return episComValue.value as EpiResponse[];
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
      status: 'Distante do vencimento',
      statusClass: 'status-good',
    });
  }

  private mapearEpiParaLinha(epi: EpiResponse): BuscaEpiRow {
    // Recupera os nomes dos funcionários vinculados.
    const nomesFuncionarios = epi.funcionarios?.map((funcionario) => funcionario.nome).join(', ');

    // Monta a linha usada pela interface.
    return this.atualizarStatusDoItem({
      id: epi.id,
      // Mostra os funcionários vinculados.
      funcionario: nomesFuncionarios || 'Não vinculado',
      // Guarda os IDs para futuras atualizações.
      funcionarioIds: epi.funcionarios?.map((funcionario) => funcionario.id) ?? [],
      nome: epi.nome,
      ca: epi.ca,
      lote: epi.lote ?? '',
      vencimento: this.formatarData(this.toDate(epi.vencimento)),
      // Situação de substituição.
      // A API devolve vencimento no formato ISO.
      // A tabela transforma a data para exibição pt-BR.
      substituido: epi.substituido ?? false,
      // Valor inicial; será recalculado logo abaixo.
      status: 'Próximo do vencimento',
      statusClass: 'status-warning',
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

  private calcularStatus(
    vencimento: Date | null,
    diasAvisoEpi: number,
  ): { status: string; statusClass: StatusClass } {
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
      substituido: false,
    };
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
