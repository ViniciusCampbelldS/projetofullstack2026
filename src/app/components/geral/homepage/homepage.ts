import { Component, OnInit } from '@angular/core';
import { TreinamentoService, ParticipacaoTreinamento, TreinamentoPortal } from '../../../services/treinamento.service';
import { CommonModule } from '@angular/common';
import { PainelAdministrativo } from './painel-administrativo/painel-administrativo';
import { PainelOperario } from './painel-operario/painel-operario';

import { NotificacaoService } from '../../../services/notificacao';
import { AuthService } from '../../../services/auth/auth';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [
		CommonModule,
		PainelOperario,
		PainelAdministrativo,
	],
	templateUrl: './homepage.html',
	styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {

	dataHoje: string;
	private participacoesTreinamento: ParticipacaoTreinamento[] = [];
	private treinamentosPortal: TreinamentoPortal[] = [];
	carregandoTreinamentos = false;	erroTreinamentos = '';





	constructor(
		private readonly notificacaoService: NotificacaoService,
		private readonly authService: AuthService,
		private readonly treinamentoService: TreinamentoService,
	) {
		this.dataHoje = this.formatarDataAtual();
	}

	ngOnInit(): void {
		this.carregandoTreinamentos = true;
		const consulta = this.isOperario ? this.treinamentoService.meusTreinamentos() : this.treinamentoService.turmas();
		consulta.subscribe({
			next: itens => {
				if (this.isOperario) this.treinamentosPortal = itens as TreinamentoPortal[];
				else this.participacoesTreinamento = itens as ParticipacaoTreinamento[];
				this.carregandoTreinamentos = false;
			},
			error: () => { this.erroTreinamentos = 'Não foi possível carregar os dados de treinamentos.'; this.carregandoTreinamentos = false; }
		});
	}

	private get treinamentosMonitorados(): ParticipacaoTreinamento[] {
		return this.participacoesTreinamento.filter(p => p.presente && p.validadeMeses > 0);
	}

	private vencimentoTreinamento(p: ParticipacaoTreinamento): Date | null {
		if (!p.presente || !p.validadeMeses) return null;
		const data = new Date(`${p.data}T12:00:00`);
		if (Number.isNaN(data.getTime())) return null;
		data.setMonth(data.getMonth() + p.validadeMeses);
		return data;
	}

	private diasAte(data: Date): number {
		const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
		const vencimento = new Date(data); vencimento.setHours(0, 0, 0, 0);
		return Math.floor((vencimento.getTime() - hoje.getTime()) / 86400000);
	}

	get totalTreinamentos(): number { return this.isOperario ? this.treinamentosPortal.length : this.treinamentosMonitorados.length; }

	private vencimentoPortal(t: TreinamentoPortal): Date | null { const d=new Date(`${t.vencimento}T12:00:00`);return t.vencimento&&!Number.isNaN(d.getTime())?d:null; }
	private diasAvisoPortal(t: TreinamentoPortal): number { return Math.max(0,t.diasAviso??30); }
	private portalPendencia(t: TreinamentoPortal): boolean { const d=this.vencimentoPortal(t);return !!d&&this.diasAte(d)<=this.diasAvisoPortal(t); }
	get treinamentosPortalPendentes(): TreinamentoPortal[] { return this.treinamentosPortal.filter(t=>this.portalPendencia(t)); }
	get pendenciasFuncionario(): Array<{titulo:string;detalhe:string;status:string;classe:string;icone:string}> {
		const epis=this.notificacaoService.episComNotificacao.map(e=>({titulo:e.nome,detalhe:`CA ${e.ca} · ${e.funcionario||'Seu EPI'}`,status:this.notificacaoService.estaVencido(e.vencimento)?'Vencido':this.notificacaoService.textoVencimentoEpi(e),classe:this.notificacaoService.estaVencido(e.vencimento)?'status-danger':'status-warning',icone:'bi-shield-exclamation'}));
		const treinamentos=this.treinamentosPortalPendentes.map(t=>({titulo:`Treinamento ${t.nr}`,detalhe:`Vencimento ${t.vencimento.split('-').reverse().join('/')}`,status:this.diasAte(this.vencimentoPortal(t)!)<0?'Vencido':'Próximo',classe:'status-warning',icone:'bi-journal-exclamation'}));
		return [...epis,...treinamentos];
	}
	get resumoFuncionario(){return [{rotulo:'EPIs vinculados',valor:String(this.notificacaoService.totalEpis),detalhe:'Dados da API',icone:'bi-shield-check',classe:'good'},{rotulo:'Treinamentos',valor:String(this.treinamentosPortal.length),detalhe:'Registros do banco',icone:'bi-journal-check',classe:'good'},{rotulo:'Pendências',valor:String(this.pendenciasFuncionario.length),detalhe:'Itens que exigem atenção',icone:'bi-exclamation-triangle',classe:this.pendenciasFuncionario.length?'warning':'good'}];}
	get totalPendenciasFuncionario(): number { return this.pendenciasFuncionario.length; }
	get treinamentosVencidos(): number { return this.treinamentosMonitorados.filter(p => { const v=this.vencimentoTreinamento(p); return v && this.diasAte(v)<0; }).length; }
	get treinamentosProximos(): number { return this.treinamentosMonitorados.filter(p => { const v=this.vencimentoTreinamento(p); const d=v?this.diasAte(v):null; return d!==null && d>=0 && d<=30; }).length; }
	get treinamentosEmDia(): number { return this.totalTreinamentos-this.treinamentosVencidos-this.treinamentosProximos; }
	get percentualTreinamentosValidos(): number { return this.totalTreinamentos ? Math.round((this.totalTreinamentos-this.treinamentosVencidos)/this.totalTreinamentos*100) : 0; }


	// =====================================================
	// PERFIL DO USUARIO
	// =====================================================

	get isOperario(): boolean {

		return (
			this.authService.obterPerfil() ===
			'Funcionário'
		);
	}


	// =====================================================
	// DADOS DO FUNCIONARIO
	// =====================================================

    get funcionario(){const u=this.authService.usuario;return {nome:u?.nome??'',matricula:String(u?.id??''),setor:u?.setor??'',cargo:u?.cargo??''};}

	// =====================================================
	// SAUDACAO
	// =====================================================

	get saudacao(): string {

		const hora =
			new Date().getHours();

		if (hora < 12) {
			return 'Bom dia';
		}

		else if (hora < 18) {
			return 'Boa tarde';
		}
		else {
		return 'Boa noite';
		}
	}


	// =====================================================
	// TOTAL DE EPIs
	// =====================================================

	get totalEpis(): number {

		return this.notificacaoService
			.totalEpis;
	}


	// =====================================================
	// EPIs EM DIA
	// =====================================================

	get episEmDia() {

		return this.notificacaoService
			.episEmDia;
	}


	// =====================================================
	// EPIs PROXIMOS DO VENCIMENTO
	// =====================================================

	get episProximos() {

		return this.notificacaoService
			.episProximos;
	}


	// =====================================================
	// EPIs VENCIDOS
	// =====================================================

	get episVencidos() {

		return this.notificacaoService
			.episVencidos;
	}


	// =====================================================
	// EPIs DENTRO DA VALIDADE
	//
	// Inclui:
	// - EPIs totalmente em dia
	// - EPIs próximos do vencimento
	//
	// Próximo do vencimento ainda é válido.
	// =====================================================

	get episDentroDaValidade() {

		return [
			...this.episEmDia,
			...this.episProximos,
		];
	}


	// =====================================================
	// PERCENTUAL DE EPIs VALIDOS
	// =====================================================

	get percentualEpisValidos(): number {

		return this.notificacaoService
			.percentualValidos;
	}


	// Mantemos este getter também para não quebrar
	// partes antigas do HTML que ainda usem
	// "percentualValidos".

	get percentualValidos(): number {

		return this.percentualEpisValidos;
	}


	// =====================================================
	// PENDENCIAS
	// =====================================================

	get totalPendencias(): number {

		return this.notificacaoService
			.totalPendencias;
	}


	get mensagemPrioridade(): string {

		return this.notificacaoService
			.mensagemPrioridade;
	}


	// =====================================================
	// EPIs COM NOTIFICACAO
	// =====================================================

	get episComNotificacao() {

		return this.notificacaoService
			.episComNotificacao;
	}


	// =====================================================
	// TREINAMENTOS / NRs
	// =====================================================

	get possuiDadosTreinamento(): boolean {

		return this.totalTreinamentos > 0;
	}


	// =====================================================
	// VERIFICAR EPI VENCIDO
	// =====================================================

	estaVencido(
		epi: {
			vencimento:
			Date |
			string |
			null;
		}
	): boolean {

		return this.notificacaoService
			.estaVencidoEpi(
				epi as never
			);
	}


	// =====================================================
	// TEXTO DE VENCIMENTO
	// =====================================================

	textoVencimento(
		epi: {
			vencimento:
			Date |
			string |
			null;
		}
	): string {

		return this.notificacaoService
			.textoVencimento(
				epi as never
			);
	}


	// =====================================================
	// DATA ATUAL
	// =====================================================

	private formatarDataAtual(): string {
		const agora = new Date();
		const data =
			this.notificacaoService
				.obterDataAtualFormatada();
		const hora =
			new Intl.DateTimeFormat(
				'pt-BR',
				{
					hour: '2-digit',
					minute: '2-digit',
				}
			).format(agora);

		return `${data} às ${hora}`;
	}
}
