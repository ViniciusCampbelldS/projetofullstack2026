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
	// Retorna os EPIs disponÃƒÂ­veis para a tela de entrega.
	//
	// Estes dados ainda sÃƒÂ£o locais.
	// Posteriormente deverÃƒÂ£o vir do endpoint GET /epis.
	getAvailableEpis(): EpiOption[] {

		return [
			{
				name: 'Capacete de seguranÃƒÂ§a',
				ca: '101022',
				validity: '2026-09-12',
			},

			{
				name: 'Luva anticorte Cut Oil Volk',
				ca: '34456',
				validity: '2026-08-28',
			},

			{
				name: 'Bota de borracha isolante',
				ca: '321124',
				validity: '2026-08-02',
			},

			{
				name: 'Ãƒâ€œculos de seguranÃƒÂ§a incolor',
				ca: '88912',
				validity: '2027-01-10',
			},

			{
				name: 'Protetor auricular plug',
				ca: '67543',
				validity: '2027-03-04',
			},
		];
	}

	// Retorna a lista inicial de entrega.
	//
	// Estes dados tambÃƒÂ©m sÃƒÂ£o temporÃƒÂ¡rios e ainda locais.
	getDeliveryDraft(): DeliveryItem[] {

		return [
			{
				epi: 'Capacete de seguranÃƒÂ§a',
				ca: '101022',
				quantity: 1,
				validity: '2026-09-12',
			},

			{
				epi: 'Luva anticorte Cut Oil Volk',
				ca: '34456',
				quantity: 1,
				validity: '2026-08-28',
			},
		];
	}

	// Retorna os EPIs exibidos no portal do funcionÃƒÂ¡rio.
	//
	// Ainda ÃƒÂ© um mock atÃƒÂ© a API de entregas ser implementada.
	getEmployeeEpis(): EmployeeEpi[] {

		return [
			{
				ca: '101022',
				name: 'Capacete com viseira e faixa refletiva',
				deliveredAt: '06/08/2026',
				status: 'Em uso',
			},

			{
				ca: '34456',
				name: 'Luva anticorte Cut Oil Volk',
				deliveredAt: '06/08/2026',
				status: 'Em uso',
			},

			{
				ca: '67543',
				name: 'Protetor auricular plug',
				deliveredAt: '04/03/2026',
				status: 'Em uso',
			},
		];
	}

	// Retorna EPIs anteriores usados no modal de substituiÃƒÂ§ÃƒÂ£o.
	//
	// Ainda ÃƒÂ© um mock enquanto o histÃƒÂ³rico de entrega
	// nÃƒÂ£o estiver implementado na API Java.
	getPreviousEpis(): PreviousEpi[] {

		return [
			{
				ca: '88912',
				name: 'Ãƒâ€œculos de seguranÃƒÂ§a incolor',
				deliveredAt: '10/01/2026',
			},

			{
				ca: '67543',
				name: 'Protetor auricular plug',
				deliveredAt: '04/03/2026',
			},

			{
				ca: '55301',
				name: 'Luva nitrÃƒÂ­lica',
				deliveredAt: '19/04/2026',
			},
		];
	}
}
