import { Injectable } from '@angular/core';

export interface EpiMonitorado {
  id: number;
  ca: string;
  nome: string;
  funcionario: string;
  vencimento: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {

  private readonly chaveDiasEpi = 'diasAvisoEpi';
  private readonly chaveDiasNr = 'diasAvisoNr';

  private readonly diasPadrao = 30;


  /* =========================================
     EPIs MONITORADOS
  ========================================= */

  readonly episMonitorados: EpiMonitorado[] = [
    {
      id: 1,
      ca: '18695',
      nome: 'Capacete em Termoplástico de Bombeiro Visor de 6" Modelo LTX Amarelo Bullard',
      funcionario: 'João Pedro da Rocha de Alcântara',
      vencimento: '2026-12-20',
    },

    {
      id: 2,
      ca: '34456',
      nome: 'Luva Anticorte Cut Oil Volk',
      funcionario: 'Fernanda Beatriz de Lima Barreto',
      vencimento: '2026-08-20',
    },

    {
      id: 3,
      ca: '51403',
      nome: 'Bota de Segurança Gogowear KW2024 100% Couro Marrom Eletricista',
      funcionario: 'Marcos Paulo Ferreira Pereira Filho',
      vencimento: '2026-08-01',
    },
  ];


  /* =========================================
     CONFIGURAÇÃO DOS DIAS
  ========================================= */

  obterDiasAvisoEpi(): number {
    const valor =
      localStorage.getItem(this.chaveDiasEpi);

    const dias = Number(valor);

    if (
      valor === null ||
      Number.isNaN(dias) ||
      dias < 0
    ) {
      return this.diasPadrao;
    }

    return dias;
  }


  obterDiasAvisoNr(): number {
    const valor =
      localStorage.getItem(this.chaveDiasNr);

    const dias = Number(valor);

    if (
      valor === null ||
      Number.isNaN(dias) ||
      dias < 0
    ) {
      return this.diasPadrao;
    }

    return dias;
  }


  salvarDiasAvisoEpi(dias: number): void {
    if (dias < 0) {
      return;
    }

    localStorage.setItem(
      this.chaveDiasEpi,
      String(dias)
    );
  }


  salvarDiasAvisoNr(dias: number): void {
    if (dias < 0) {
      return;
    }

    localStorage.setItem(
      this.chaveDiasNr,
      String(dias)
    );
  }


  /* =========================================
     CÁLCULO DO VENCIMENTO
  ========================================= */

  calcularDiasRestantes(
    vencimento: Date | string | null
  ): number | null {

    if (!vencimento) {
      return null;
    }

    const hoje = new Date();

    const dataVencimento =
      new Date(vencimento);

    if (
      Number.isNaN(
        dataVencimento.getTime()
      )
    ) {
      return null;
    }

    hoje.setHours(
      0,
      0,
      0,
      0
    );

    dataVencimento.setHours(
      0,
      0,
      0,
      0
    );

    const diferenca =
      dataVencimento.getTime() -
      hoje.getTime();

    return Math.ceil(
      diferenca /
      (1000 * 60 * 60 * 24)
    );
  }


  /* =========================================
     EPI PRÓXIMO DO VENCIMENTO
  ========================================= */

  deveAvisarEpi(
    vencimento: Date | string | null
  ): boolean {

    const diasRestantes =
      this.calcularDiasRestantes(
        vencimento
      );

    if (
      diasRestantes === null
    ) {
      return false;
    }

    return (
      diasRestantes >= 0 &&
      diasRestantes <=
        this.obterDiasAvisoEpi()
    );
  }


  /* =========================================
     NR PRÓXIMA DO VENCIMENTO
  ========================================= */

  deveAvisarNr(
    vencimento: Date | string | null
  ): boolean {

    const diasRestantes =
      this.calcularDiasRestantes(
        vencimento
      );

    if (
      diasRestantes === null
    ) {
      return false;
    }

    return (
      diasRestantes >= 0 &&
      diasRestantes <=
        this.obterDiasAvisoNr()
    );
  }


  /* =========================================
     ITEM JÁ VENCIDO
  ========================================= */

  estaVencido(
    vencimento: Date | string | null
  ): boolean {

    const diasRestantes =
      this.calcularDiasRestantes(
        vencimento
      );

    return (
      diasRestantes !== null &&
      diasRestantes < 0
    );
  }


  /* =========================================
     EPIs QUE DEVEM APARECER NO SINO
  ========================================= */

  obterEpisComNotificacao(): EpiMonitorado[] {

    return this.episMonitorados.filter(
      (epi) => {

        return (
          this.estaVencido(
            epi.vencimento
          ) ||
          this.deveAvisarEpi(
            epi.vencimento
          )
        );

      }
    );
  }

  // =====================================================
  // STATUS COMPARTILHADO DOS EPIs
  // =====================================================

  get todosEpis(): EpiMonitorado[] {
    return this.episMonitorados;
  }

  get totalEpis(): number {
    return this.todosEpis.length;
  }

  get episComNotificacao(): EpiMonitorado[] {
    return this.obterEpisComNotificacao();
  }

  get episVencidos(): EpiMonitorado[] {
    return this.todosEpis.filter((epi) => this.estaVencido(epi.vencimento));
  }

  get episProximos(): EpiMonitorado[] {
    return this.todosEpis.filter(
      (epi) =>
        !this.estaVencido(epi.vencimento) && this.deveAvisarEpi(epi.vencimento)
    );
  }

  get episEmDia(): EpiMonitorado[] {
    return this.todosEpis.filter(
      (epi) =>
        !this.estaVencido(epi.vencimento) && !this.deveAvisarEpi(epi.vencimento)
    );
  }

  get totalPendencias(): number {
    return this.episComNotificacao.length;
  }

  get percentualValidos(): number {
    if (this.totalEpis === 0) {
      return 100;
    }

    const validos = this.totalEpis - this.episVencidos.length;
    return Math.round((validos / this.totalEpis) * 100);
  }

  get mensagemPrioridade(): string {
    if (this.episVencidos.length > 0) {
      if (this.episVencidos.length === 1) {
        return '1 EPI vencido requer ação imediata.';
      }

      return `${this.episVencidos.length} EPIs vencidos requerem ação imediata.`;
    }

    if (this.episProximos.length > 0) {
      if (this.episProximos.length === 1) {
        return '1 EPI está próximo do vencimento.';
      }

      return `${this.episProximos.length} EPIs estão próximos do vencimento.`;
    }

    return 'Nenhuma pendência crítica no momento.';
  }

  estaVencidoEpi(epi: EpiMonitorado): boolean {
    return this.estaVencido(epi.vencimento);
  }

  textoVencimento(epi: EpiMonitorado): string {
    const dias = this.calcularDiasRestantes(epi.vencimento);

    if (dias === null) {
      return 'Data inválida';
    }

    if (dias < 0) {
      const diasVencido = Math.abs(dias);

      if (diasVencido === 1) {
        return 'Vencido há 1 dia';
      }

      return `Vencido há ${diasVencido} dias`;
    }

    if (dias === 0) {
      return 'Vence hoje';
    }

    if (dias === 1) {
      return 'Vence em 1 dia';
    }

    return `Vence em ${dias} dias`;
  }

  obterDataAtualFormatada(): string {
    const data = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    return data.charAt(0).toUpperCase() + data.slice(1);
  }

  /* =========================================
     QUANTIDADE DE NOTIFICAÇÕES DE EPI
  ========================================= */

  obterTotalNotificacoesEpi(): number {

    return this
      .obterEpisComNotificacao()
      .length;
  }
}