import {
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import {
  NotificacaoService,
  EpiMonitorado,
} from './service/notificacao';
import { AuthService } from './service/auth';

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

  readonly rotaMeusEpis = ['/funcionario/meus-epis'];
  readonly rotaMeusTreinamentos = ['/funcionario/meus-treinamentos'];
  readonly rotaEpiBusca = ['/epi/busca'];
  readonly rotaEpiCadastro = ['/epi/cadastro'];
  readonly rotaEpiEntrega = ['/epi/entrega'];
  readonly rotaEpiHistorico = ['/epi/historico'];

  estaNoTopo = true;

  notificacoesAbertas = false;
  configuracaoAberta = false;

  diasAvisoEpi: number;
  diasAvisoNr: number;

  constructor(
    private readonly router: Router,
    private readonly notificacaoService: NotificacaoService,
    private readonly authService: AuthService,
  ) {
    this.diasAvisoEpi =
      this.notificacaoService.obterDiasAvisoEpi();

    this.diasAvisoNr =
      this.notificacaoService.obterDiasAvisoNr();

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
          epi.vencimento
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

  salvarConfiguracao(event?: MouseEvent): void {
    event?.stopPropagation();

    if (
      this.diasAvisoEpi < 0 ||
      this.diasAvisoNr < 0
    ) {
      return;
    }

    this.notificacaoService
      .salvarDiasAvisoEpi(
        this.diasAvisoEpi
      );

    this.notificacaoService
      .salvarDiasAvisoNr(
        this.diasAvisoNr
      );

    this.configuracaoAberta = false;
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

