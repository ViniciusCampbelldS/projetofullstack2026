import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
	EpiBulkCreateResponse,
	EpiCreateRequest,
	EpiRequest,
	EpiResponse,
	EpiUpdateRequest, EntregaEpiRequest, EntregaEpiResponse, FichaEntrega
} from '../models/epi';

// ServiÃƒÂ§o responsÃƒÂ¡vel pela comunicaÃƒÂ§ÃƒÂ£o dos EPIs com a API Java.
@Injectable({
	providedIn: 'root'
})
export class EpiService {

	//CLiente para fazer as requisiÃƒÂ§ÃƒÂµes HTTP para a API.
	private readonly http = inject(HttpClient);
	// Endpoint principal dos EPIs.
	private readonly apiEpis = `${environment.apiUrl}/epis`;

 meusEpis(){return this.http.get<Array<{id:number;ca:number;nome:string;vencimento:string;substituido:boolean}>>(`${environment.apiUrl}/portal/epis`);}
 relatar(epiId:number,situacao:string,comentario:string){return this.http.post<void>(`${environment.apiUrl}/portal/relatos`,{epiId,situacao,comentario});}

 sugestoes(ca:string){return this.http.get<Array<{ca:number;nome:string}>>(`${this.apiEpis}/sugestoes`,{params:{ca}});}

 listarDisponiveis(){return this.http.get<EpiResponse[]>(`${this.apiEpis}/disponiveis`);}
 entregar(request: EntregaEpiRequest, ficha: File | null = null) {
   const url = `${environment.apiUrl}/entregas-epis`;
   if (!ficha) return this.http.post<EntregaEpiResponse>(url, request);

   const dados = new FormData();
   dados.append('entrega', new Blob([JSON.stringify(request)], { type: 'application/json' }));
   dados.append('ficha', ficha);
   return this.http.post<EntregaEpiResponse>(url, dados);
 }

 minhasFichas() {
   return this.http.get<FichaEntrega[]>(`${environment.apiUrl}/portal/fichas-epi`);
 }

 baixarFicha(id: number, nome: string) {
   return this.http.get(`${environment.apiUrl}/portal/fichas-epi/${id}`, { responseType: 'blob' }).pipe(
     tap(arquivo => {
       const url = URL.createObjectURL(arquivo);
       const link = document.createElement('a');
       link.href = url;
       link.download = nome;
       document.body.appendChild(link);
       link.click();
       link.remove();
       window.setTimeout(() => URL.revokeObjectURL(url), 1000);
     }),
   );
 }
 listarEntregas(funcionarioId:number){return this.http.get<EntregaEpiResponse[]>(`${environment.apiUrl}/entregas-epis`,{params:{funcionarioId}});}

 substituir(id:number,novoEpiId:number,motivo:string,data:string){return this.http.post<void>(`${this.apiEpis}/${id}/substituicao`,{novoEpiId,motivo,data});}
 descartar(id:number,motivo:string,data:string){return this.http.post<void>(`${this.apiEpis}/${id}/descarte`,{motivo,data});}

	// GET /epis
	//
	// Lista todos os EPIs.
	listar(): Observable<EpiResponse[]> {
		return this.http.get<EpiResponse[]>(this.apiEpis);
	}

	// POST /epis
	//
	// Cadastra um ÃƒÂºnico EPI.
	cadastrar(epi: EpiRequest): Observable<EpiResponse> {
		return this.http.post<EpiResponse>(
			this.apiEpis,
			epi
		);
	}

	// POST /epis
	//
	// Cadastra um ÃƒÂºnico EPI.
	cadastrarEmLote(request: EpiCreateRequest): Observable<EpiBulkCreateResponse> {

		return this.http.post<EpiBulkCreateResponse>(
			`${this.apiEpis}/bulk`,
			request
		);
	}

	// PUT /epis/{id}
	//
	// Atualiza completamente um EPI.
	atualizar(id: number, epi: EpiUpdateRequest): Observable<EpiResponse> {

		return this.http.put<EpiResponse>(
			`${this.apiEpis}/${id}`,
			epi
		);
	}

	// DELETE /epis/{id}
	//
	// Remove o EPI.
	excluir(id: number): Observable<void> {
		return this.http.delete<void>(
			`${this.apiEpis}/${id}`
		);
	}
}
