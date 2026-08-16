import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelAdministrativo } from './painel-administrativo/painel-administrativo';
import { PainelOperario } from './painel-operario/painel-operario';

import { NotificacaoService } from '../../../service/notificacao';
import { AuthService } from '../../../service/auth';

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
export class Homepage {

	dataHoje: string;



	// TREINAMENTOS
	// Vinicius, Ainda não existe uma base real de treinamentos/NRs
	// ligada à homepage.
	//
	// Por isso deixamos 0 e exibimos "Sem dados".
	// Depois podemos conectar isso ao serviço de treinamento.

	readonly totalTreinamentos = 0;


	constructor(
		private readonly notificacaoService: NotificacaoService,
		private readonly authService: AuthService,
	) {
		this.dataHoje =
			this.formatarDataAtual();
	}


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

	readonly funcionario = {
		nome: 'Joao Pedro da Rocha',
		matricula: '1001',
		setor: 'Operacoes',
		cargo: 'Operador',
	};


	readonly resumoFuncionario = [
		{
			rotulo: 'EPIs ativos',
			valor: '3',
			detalhe: 'Todos vinculados ao cadastro',
			icone: 'bi-shield-check',
			classe: 'good',
		},
		{
			rotulo: 'Treinamentos',
			valor: '3',
			detalhe: 'NR 06, NR 10 e NR 35',
			icone: 'bi-journal-check',
			classe: 'good',
		},
		{
			rotulo: 'Proximo vencimento',
			valor: '20/08',
			detalhe: 'NR 35 vence em breve',
			icone: 'bi-exclamation-triangle',
			classe: 'warning',
		},
		{
			rotulo: 'Pendencias',
			valor: '1',
			detalhe: 'Requer acompanhamento',
			icone: 'bi-clipboard-pulse',
			classe: 'warning',
		},
	];


	readonly pendenciasFuncionario = [
		{
			titulo: 'NR 35 - Trabalho em Altura',
			detalhe: 'Validade ate 20/08/2026.',
			status: 'Proximo',
			classe: 'status-warning',
			icone: 'bi-cone-striped',
		},
		{
			titulo: 'Ficha de entrega de EPI',
			detalhe:
				'Documentos de EPI disponiveis para consulta.',
			status: 'Em dia',
			classe: 'status-good',
			icone: 'bi-file-earmark-check',
		},
		{
			titulo: 'Relato de estado dos EPIs',
			detalhe:
				'Nenhum relato pendente no momento.',
			status: 'Em dia',
			classe: 'status-good',
			icone: 'bi-clipboard2-check',
		},
	];


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
