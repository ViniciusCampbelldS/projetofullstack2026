import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HistoricoComentario { texto: string; criadoEm: string; }
export interface HistoricoEvento {
  id: number; autorId: number | null; autorNome: string | null; criadoEm: string;
  areaDoSite: string; registroId: number; acao: string;
  antes: Record<string, unknown> | null; depois: Record<string, unknown> | null;
  comentarios: HistoricoComentario[];
}
export interface EventoPessoal { criadoEm: string; acao: string; antes: Record<string, unknown> | null; depois: Record<string, unknown> | null; }
export interface PaginaPessoal { itens: EventoPessoal[]; total: number; pagina: number; tamanho: number; }
interface Pagina { itens: HistoricoEvento[]; total: number; }

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/historico`;

  listar(area: string, pagina: number, tamanho: number): Observable<Pagina> {
    const params = new HttpParams()
      .set('areaDoSite', area)
      .set('pagina', pagina)
      .set('tamanho', tamanho);
    return this.http.get<Pagina>(this.api, { params });
  }

  listarPessoal(pagina: number, tamanho: number): Observable<PaginaPessoal> {
    const params = new HttpParams().set('pagina', pagina).set('tamanho', tamanho);
    return this.http.get<PaginaPessoal>(`${environment.apiUrl}/portal/historico`, { params });
  }

  comentar(id: number, texto: string) {
    return this.http.post<HistoricoComentario[]>(`${this.api}/${id}/comentarios`, { texto });
  }
}