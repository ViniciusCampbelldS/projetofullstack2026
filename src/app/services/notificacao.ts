import {AuthService} from './auth/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EpiMonitorado {
  id: number;
  ca: string;
  nome: string;
  funcionario: string;
  vencimento: string;
  contaIndicador?: boolean;
}

export interface RegraAviso {
  id: number;
  caOuNr: string;
  diasAviso: number;
  isNorma: boolean; //true é um número de NR, false é um CA de EPI
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {

  private readonly http = inject(HttpClient);
  private readonly apiAvisos = `${environment.apiUrl}/dias-notificacao`;
  private endpoint(norma:boolean){return this.apiAvisos+(norma?'-treinamentos':'-epis');}
  private converter(r:{id:number;ca?:number;nr?:number;diasAviso:number},isNorma:boolean):RegraAviso{return {id:r.id,caOuNr:String(isNorma?r.nr:r.ca),diasAviso:r.diasAviso,isNorma};}
  private readonly regrasAvisoState = signal<RegraAviso[]>([]);
  readonly regrasAviso = this.regrasAvisoState.asReadonly();
  private readonly diasPadrao = 30;


  /* =========================================
     EPIs MONITORADOS
  ========================================= */

  episMonitorados:EpiMonitorado[]=[];
  private avisosProprios=new Map<string,number>();
  private readonly auth=inject(AuthService);
  carregarEpis() {
    const administrativo = this.auth.podeVerAdministracao();
    const url = administrativo ? `${environment.apiUrl}/epis` : `${environment.apiUrl}/portal/epis`;
    return this.http.get<any[]>(url).pipe(tap(items => {
      this.avisosProprios = new Map(items.map(e => [String(e.ca), e.diasAviso ?? 30]));
      this.episMonitorados = items.map(e => {
        const responsaveis = e.funcionarios ?? [];
        const elegiveis = responsaveis.filter((f: any) => f.status !== 'In');
        return { id: e.id, ca: String(e.ca), nome: e.nome, funcionario: elegiveis.map((f: any) => f.nome).join(', '), vencimento: e.vencimento,
          contaIndicador: !e.substituido && !e.dataDescarte && (!administrativo || responsaveis.length === 0 || elegiveis.length > 0) };
      });
    }));
  }


  carregarRegrasAviso(): Observable<RegraAviso[]> {
    return forkJoin([this.http.get<any[]>(this.endpoint(false)),this.http.get<any[]>(this.endpoint(true))]).pipe(map(([epis,nrs])=>[...epis.map(r=>this.converter(r,false)),...nrs.map(r=>this.converter(r,true))]),tap(regras=>this.regrasAvisoState.set(regras)));
  }

  obterDiasAviso(caOuNr: string, isNorma: boolean): number {
    const chave = this.normalizarCaOuNr(caOuNr);
    if(!this.auth.podeVerAdministracao())return this.avisosProprios.get(chave)??30;
    return this.regrasAvisoState().find(
      (regra) => regra.isNorma === isNorma && this.normalizarCaOuNr(regra.caOuNr) === chave,
    )?.diasAviso ?? this.diasPadrao;
  }

  salvarRegraAviso(regra: Omit<RegraAviso, 'id'>): Observable<RegraAviso> {
    const chave = this.normalizarCaOuNr(regra.caOuNr);
    const existente = this.regrasAvisoState().find(
      (item) => item.isNorma === regra.isNorma && this.normalizarCaOuNr(item.caOuNr) === chave,
    );
    const payload = regra.isNorma?{nr:Number(regra.caOuNr),diasAviso:regra.diasAviso}:{ca:Number(regra.caOuNr),diasAviso:regra.diasAviso};
    const request = existente
      ? this.http.put<RegraAviso>(`${this.endpoint(regra.isNorma)}/${existente.id}`, payload)
      : this.http.post<RegraAviso>(this.endpoint(regra.isNorma), payload);

    return request.pipe(
      map(r=>this.converter(r,regra.isNorma)),
      tap((salva) => this.regrasAvisoState.update((regras) => [
        ...regras.filter((item) => !(item.id === salva.id && item.isNorma === salva.isNorma) && !(item.isNorma === salva.isNorma && this.normalizarCaOuNr(item.caOuNr) === chave)),
        salva,
      ])),
    );
  }

  excluirRegraAviso(id: number, isNorma: boolean): Observable<void> {
    return this.http.delete<void>(`${this.endpoint(isNorma)}/${id}`).pipe(
      tap(() => this.regrasAvisoState.update((regras) => regras.filter((item) => !(item.id === id && item.isNorma === isNorma)))),
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
    vencimento: Date | string | null,
    caOuNr: string,
    isNorma = false,
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
        this.obterDiasAviso(caOuNr, isNorma)
    );
  }


  /* =========================================
     NR PRÓXIMA DO VENCIMENTO
  ========================================= */

  deveAvisarNr(
    vencimento: Date | string | null,
    caOuNr: string,
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
        this.obterDiasAviso(caOuNr, true)
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
            epi.vencimento,
            epi.ca,
            false,
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

  get episParaIndicadores(): EpiMonitorado[] {
    return this.todosEpis.filter(epi => epi.contaIndicador !== false);
  }

  get totalEpis(): number {
    return this.episParaIndicadores.length;
  }

  get episComNotificacao(): EpiMonitorado[] {
    return this.obterEpisComNotificacao();
  }

  get episVencidos(): EpiMonitorado[] {
    return this.episParaIndicadores.filter((epi) => this.estaVencido(epi.vencimento));
  }

  get episProximos(): EpiMonitorado[] {
    return this.episParaIndicadores.filter(
      (epi) =>
        !this.estaVencido(epi.vencimento) && this.deveAvisarEpi(epi.vencimento, epi.ca)
    );
  }

  get episEmDia(): EpiMonitorado[] {
    return this.episParaIndicadores.filter(
      (epi) =>
        !this.estaVencido(epi.vencimento) && !this.deveAvisarEpi(epi.vencimento, epi.ca)
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

  private normalizarCaOuNr(caOuNr: string): string {
    return caOuNr.trim().toLocaleUpperCase('pt-BR');
  }
}