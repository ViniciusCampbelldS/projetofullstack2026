import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EpiBulkCreateResponse, EpiCreateRequest, EpiResponse, EpiUpdateRequest } from '../models/epi';

@Injectable({ providedIn: 'root' })
export class EpiService {
	private readonly http = inject(HttpClient);
	private readonly apiEpis = `${environment.apiUrl}/epis`;

	listar(): Observable<EpiResponse[]> {
		return this.http.get<EpiResponse[]>(this.apiEpis);
	}

	cadastrar(epi: EpiCreateRequest): Observable<EpiBulkCreateResponse> {
		return this.http.post<EpiBulkCreateResponse>(this.apiEpis, epi);
	}

	atualizar(id: number, epi: EpiUpdateRequest): Observable<EpiResponse> {
		return this.http.put<EpiResponse>(`${this.apiEpis}/${id}`, epi);
	}

	excluir(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiEpis}/${id}`);
	}
	
  registrarEntrega(payload: { funcionarioId: number; dataEntrega: string; epiIds: number[]; epiSubstituidoId?: number }): Observable<Array<{ id: number; epiId: number; funcionarioId: number; dataEntrega: string }>> {
    return this.http.post<Array<{ id: number; epiId: number; funcionarioId: number; dataEntrega: string }>>(`${environment.apiUrl}/entregas`, payload);
  }

  listarMinhasEntregas(): Observable<Array<{ id: number; epiId: number; epi: string; ca: string; funcionarioId: number; funcionario: string; dataEntrega: string }>> {
    return this.http.get<Array<{ id: number; epiId: number; epi: string; ca: string; funcionarioId: number; funcionario: string; dataEntrega: string }>>(`${environment.apiUrl}/entregas/minhas`);
  }

  listarEntregas(): Observable<Array<{ id: number; epiId: number; epi: string; ca: string; funcionarioId: number; funcionario: string; dataEntrega: string }>> {
    return this.http.get<Array<{ id: number; epiId: number; epi: string; ca: string; funcionarioId: number; funcionario: string; dataEntrega: string }>>(`${environment.apiUrl}/entregas`);
  }

}
