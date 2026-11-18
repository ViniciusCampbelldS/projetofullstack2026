import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HistoricoComentario { texto: string; criadoEm: string; }
export interface HistoricoEvento {
  id: number; autorId: number | null; autorNome: string | null; criadoEm: string;
  areaDoSite: string; registroId: number; acao: string;
  antes: Record<string, unknown> | null; depois: Record<string, unknown> | null;
  comentarios: HistoricoComentario[];
}
interface Pagina { itens: HistoricoEvento[]; total: number; }

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/historico`;

  listar(areas: string[], tamanho = 100): Observable<HistoricoEvento[]> {
    return forkJoin(areas.map((area) =>
      this.http.get<Pagina>(this.api, { params: new HttpParams().set('areaDoSite', area).set('tamanho', tamanho) })
    )).pipe(map((paginas) => paginas.flatMap((p) => p.itens)
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))));
  }

  comentar(id: number, texto: string) {
    return this.http.post<HistoricoComentario[]>(`${this.api}/${id}/comentarios`, { texto });
  }
}