import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { NotificacaoService, EpiMonitorado, RegraAviso } from './services/notificacao';
import { AuthService } from './services/auth/auth';

@Component({
  selector: 'app-root',
  host: {
    '(window:scroll)': 'onWindowScroll()',
    '(document:click)': 'fecharNotificacoesSeClicarFora($event)',
  },
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
	protected readonly title = signal('tst-gestao');
  readonly rotaMeusEpis = ['/funcionario/meus-epis'];
  readonly rotaMeusTreinamentos = ['/funcionario/meus-treinamentos'];
  readonly rotaEpiBusca = ['/epi/busca'];
  readonly rotaEpiCadastro = ['/epi/cadastro'];
  readonly rotaEpiEntrega = ['/epi/entrega'];
  readonly rotaEpiHistorico = ['/epi/historico'];

  estaNoTopo = true;

  notificacoesAbertas = false;
  configuracaoAberta = false;

  regraCaOuNr = '';
  isNorma = false;
  diasAviso = 30;
  erroConfiguracaoAviso = '';

  constructor(
    private readonly router: Router,
    private readonly notificacaoService: NotificacaoService,
    private readonly authService: AuthService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.notificacaoService.carregarEpis().subscribe({ error: () => {} });
    }
    this.notificacaoService.carregarRegrasAviso().subscribe({
      error: () => {
        this.erroConfiguracaoAviso = 'Não foi possível carregar as regras de aviso.';
      },
    });

    this.atualizarPosicaoScroll();
  }

  /* =========================================
     HEADER
  ========================================= */

  get showHeader(): boolean {
    return this.router.url !== '/login';
  }

  get isTst(): boolean {
    return this.authService.obterPerfil() === 'Técnico de Segurança do Trabalho';
  }

  get isOperario(): boolean {
    return this.authService.obterPerfil() === 'Funcionário';
  }

  get isFuncionarioArea(): boolean {
    return this.router.url.startsWith('/funcionario');
  }

  get tituloArea(): string {
    if (this.isOperario) {
      return 'Portal do funcionário';
    }

    if (!this.isFuncionarioArea) {
      return 'Sistema de Gerenciamento';
    }

    return 'Minha área';
  }

  get subtituloArea(): string {
    return this.isFuncionarioArea || this.isOperario
      ? 'Área individual de segurança'
      : 'Segurança do Trabalho';
  }
 /* =========================================
     SOMENTE EPIs PRÓXIMOS DO VENCIMENTO
  ========================================= */

  get episProximosDoVencimento(): EpiMonitorado[] {
    return this.episComNotificacao.filter(
      (epi) =>
        !this.notificacaoService.estaVencido(
          epi.vencimento
        ) &&
        this.notificacaoService.deveAvisarEpi(
          epi.vencimento,
          epi.ca,
        )
    );
  }


  /* =========================================
     QUANTIDADE NO SINO
  ========================================= */

  get totalNotificacoes(): number {
    return this.episComNotificacao.length;
  }

  /* =========================================
     DIAS RESTANTES
  ========================================= */

  diasRestantes(
    epi: EpiMonitorado
  ): number | null {

    return this.notificacaoService
      .calcularDiasRestantes(
        epi.vencimento
      );
  }

  /* =========================================
     ABRIR / FECHAR NOTIFICAÇÕES
  ========================================= */

  alternarNotificacoes(event?: MouseEvent): void {
    event?.stopPropagation();

    this.notificacoesAbertas =
      !this.notificacoesAbertas;

    if (!this.notificacoesAbertas) {
      this.configuracaoAberta = false;
    }
  }


  /* =========================================
     ABRIR CONFIGURAÇÕES
  ========================================= */

  alternarConfiguracao(event?: MouseEvent): void {
    event?.stopPropagation();

    this.configuracaoAberta =
      !this.configuracaoAberta;
  }


  /* =========================================
     SALVAR CONFIGURAÇÃO
  ========================================= */

  get regrasAviso(): RegraAviso[] {
    return this.notificacaoService.regrasAviso();
  }

  editarRegraAviso(regra: RegraAviso): void {
    this.regraCaOuNr = regra.caOuNr;
    this.isNorma = regra.isNorma;
    this.diasAviso = regra.diasAviso;
    this.erroConfiguracaoAviso = '';
  }

  salvarRegraAviso(event?: MouseEvent): void {
    event?.stopPropagation();

    const caOuNr = this.regraCaOuNr.trim();
    if (!caOuNr || caOuNr.length > 15 || !Number.isInteger(this.diasAviso) || this.diasAviso <= 0) {
      this.erroConfiguracaoAviso = 'Informe CA/NR com até 15 caracteres e dias de aviso inteiro maior que zero.';
      return;
    }

    this.notificacaoService
      .salvarRegraAviso({ caOuNr, diasAviso: this.diasAviso, isNorma: this.isNorma })
      .subscribe({
        next: () => {
          this.regraCaOuNr = '';
          this.isNorma = false;
          this.diasAviso = 30;
          this.erroConfiguracaoAviso = '';
        },
        error: () => {
          this.erroConfiguracaoAviso = 'Não foi possível salvar a regra de aviso.';
        },
      });
  }

  excluirRegraAviso(regra: RegraAviso, event?: MouseEvent): void {
    event?.stopPropagation();
    this.notificacaoService.excluirRegraAviso(regra.id).subscribe({
      error: () => {
        this.erroConfiguracaoAviso = 'Não foi possível excluir a regra de aviso.';
      },
    });
  }

  fecharNotificacoesSeClicarFora(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;

    if (target?.closest('.notification-area')) {
      return;
    }

    this.notificacoesAbertas = false;
    this.configuracaoAberta = false;
  }

  onWindowScroll(): void {
    this.atualizarPosicaoScroll();
  }

  voltarAoTopo(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  irParaEpi(view: 'busca' | 'cadastro' | 'entrega' | 'historico'): void {
    void this.router.navigate(['/epi', view]);
  }

  // =====================================================
  // STATUS COMPARTILHADO DOS EPIs
  // =====================================================

  get todosEpis(): EpiMonitorado[] {
    return this.notificacaoService.todosEpis;
  }

  get totalEpis(): number {
    return this.notificacaoService.totalEpis;
  }

  get episComNotificacao(): EpiMonitorado[] {
    return this.notificacaoService.episComNotificacao;
  }

  get episVencidos(): EpiMonitorado[] {
    return this.notificacaoService.episVencidos;
  }

  get episProximos(): EpiMonitorado[] {
    return this.notificacaoService.episProximos;
  }

  get episEmDia(): EpiMonitorado[] {
    return this.notificacaoService.episEmDia;
  }

  get totalPendencias(): number {
    return this.notificacaoService.totalPendencias;
  }

  get percentualValidos(): number {
    return this.notificacaoService.percentualValidos;
  }

  get mensagemPrioridade(): string {
    return this.notificacaoService.mensagemPrioridade;
  }

  estaVencido(epi: EpiMonitorado): boolean {
    return this.notificacaoService.estaVencidoEpi(epi);
  }

  textoVencimento(epi: EpiMonitorado): string {
    return this.notificacaoService.textoVencimento(epi);
  }

  private atualizarPosicaoScroll(): void {
    this.estaNoTopo =
      typeof window === 'undefined' ||
      window.scrollY <= 8;
  }

  private formatarDataAtual(): string {
    return this.notificacaoService.obterDataAtualFormatada();
  }
};

