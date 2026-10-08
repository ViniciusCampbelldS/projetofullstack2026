import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
	EpiBulkCreateResponse,
	EpiCreateRequest,
	EpiRequest,
	EpiResponse,
	EpiUpdateRequest
} from '../models/epi';
import { DeliveryItem, EmployeeEpi, EpiOption, EpiRecord, HistoryEntry, PreviousEpi } from '../components/epi/epi.models';

// Serviço responsável pela comunicação dos EPIs com a API Java.
@Injectable({
	providedIn: 'root'
})
export class EpiService {

	//CLiente para fazer as requisições HTTP para a API.
	private readonly http = inject(HttpClient);
	// Endpoint principal dos EPIs.
	private readonly apiEpis = `${environment.apiUrl}/epis`;

	// GET /epis
	//
	// Lista todos os EPIs.
	listar(): Observable<EpiResponse[]> {
		return this.http.get<EpiResponse[]>(this.apiEpis);
	}

	// POST /epis
	//
	// Cadastra um único EPI.
	cadastrar(epi: EpiRequest): Observable<EpiResponse> {
		return this.http.post<EpiResponse>(
			this.apiEpis,
			epi
		);
	}

	// POST /epis
	//
	// Cadastra um único EPI.
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

	//#TODO - Não implementado, apenas front-end.
	getHistory(): HistoryEntry[] {
		return [
			{
				data: '06/08/2026 09:48',
				usuario: 'Admin SST',
				registro: 'CPF 16779645, CA 11022 e 34456',
				alteracao: 'Entrega registrada',
				detalhe: 'Ficha digital criada para João Pedro com 2 EPIs.',
			},
			{
				data: '05/08/2026 16:20',
				usuario: 'Admin SST',
				registro: 'CA 34456',
				alteracao: 'Manual',
				detalhe: 'Alterado o número de dias para notificação de próximo do vencimento para CA 34456.',
			},
			{
				data: '02/08/2026 11:05',
				usuario: 'Admin SST',
				registro: 'CPF 20724369, CA 40271',
				alteracao: 'Substituição',
				detalhe: 'Bota isolante anterior substituída por vencimento.',
			},
		];
	}
	// Retorna os EPIs disponíveis para a tela de entrega.
	//
	// Estes dados ainda são locais.
	// Posteriormente deverão vir do endpoint GET /epis.
	getAvailableEpis(): EpiOption[] {

		return [
			{
				name: 'Capacete de segurança',
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
				name: 'Óculos de segurança incolor',
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
	// Estes dados também são temporários e ainda locais.
	getDeliveryDraft(): DeliveryItem[] {

		return [
			{
				epi: 'Capacete de segurança',
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

	// Retorna os EPIs exibidos no portal do funcionário.
	//
	// Ainda é um mock até a API de entregas ser implementada.
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

	// Retorna EPIs anteriores usados no modal de substituição.
	//
	// Ainda é um mock enquanto o histórico de entrega
	// não estiver implementado na API Java.
	getPreviousEpis(): PreviousEpi[] {

		return [
			{
				ca: '88912',
				name: 'Óculos de segurança incolor',
				deliveredAt: '10/01/2026',
			},

			{
				ca: '67543',
				name: 'Protetor auricular plug',
				deliveredAt: '04/03/2026',
			},

			{
				ca: '55301',
				name: 'Luva nitrílica',
				deliveredAt: '19/04/2026',
			},
		];
	}
}
