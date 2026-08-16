import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Epi } from '../epi.models';
import { NotificacaoService } from '../../../service/notificacao';

@Component({
	selector: 'app-epi-status',
	standalone: true,
	templateUrl: './epi-status.html',
	styleUrls: ['./epi-status.scss'],
})
export class EpiStatus {
	get totalEpis(): number {
		return this.notificacaoService.totalEpis;
	}

	get episEmDia() {
		return this.notificacaoService.episEmDia;
	}

	get episProximos() {
		return this.notificacaoService.episProximos;
	}

	get episVencidos() {
		return this.notificacaoService.episVencidos;
	}

	constructor(private readonly notificacaoService: NotificacaoService) {}
}

@Injectable({
	providedIn: 'root',
})
export class EpiService {
	private apiUrl = 'http://localhost:3000/epis';

	// O construtor injeta o serviço HttpClient para fazer requisições HTTP
	constructor(private http: HttpClient) { }

	// Converte um valor desconhecido em um objeto Date ou null
	private toDate(value: unknown): Date | null {
		
		// Se o valor for uma data válida, retorna o objeto Date correspondente
		// Number.isNaN verifica se o valor é nulo ou indefinido, e retorna null nesse caso
		if (value instanceof Date) {
			return Number.isNaN(value.getTime()) ? null : value;
		}
		
		// Se o valor for uma string não vazia, tenta convertê-lo em um objeto Date
		else if (typeof value === 'string' && value.trim()) {
			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? null : parsed;
		}
		
		// Se o valor for nulo ou indefinido, retorna null
		else { return null; }
	}

	// Garante que a propriedade vencimento seja um objeto Date ou null
	private normalizeEpi(epi: Partial<Epi> | null | undefined): Partial<Epi> {
		
		// Converte o objeto Epi em um objeto parcial, copiando todas as propriedades do objeto original, exceto a propriedade vencimento
		const normalized = { ...(epi ?? {}) } as Partial<Epi>;
		
		// Converte a propriedade vencimento em um objeto Date ou null, usando o método .toDate
		const parsedDate = this.toDate(normalized.vencimento);
		return {
			
			// Copia todas as propriedades do objeto parcial normalizado, exceto a propriedade vencimento, que é substituída pelo valor convertido em Date ou null
			...normalized,
			
			// Se a propriedade vencimento for inválida, retorna null
			vencimento: parsedDate ?? null,
		};
	}

	// Faz uma requisição GET para a API e retorna um Observable de uma lista de objetos Epi
	listar(): Observable<Epi[]> {
		
		// Faz uma requisição GET para a API, retornando um Observable de uma lista de objetos Epi
		return this.http.get<Epi[]>(this.apiUrl).pipe(
			
			// Normaliza cada objeto Epi na lista, garantindo que a propriedade vencimento seja um objeto Date
			map((epis) => (Array.isArray(epis) ? epis.map((epi) => this.normalizeEpi(epi) as Epi) : []))
		);
	}

	// por enquanto usamos esse e especificamos o id do EPI junto com o push. o método cadastrar vai gerar o id automaticamente
	create(epi: Partial<Epi>): Observable<Epi> {
		const payload = this.normalizeEpi(epi);
		return this.http.post<Epi>(this.apiUrl, payload);
	}

	//como create, mas omite o campo 'id' para que o backend gere automaticamente o id do novo EPI
	cadastrar(epi: Omit<Epi, 'id'>): Observable<Epi> {
		
		// Garante que a propriedade vencimento seja um objeto Date
		const payload = this.normalizeEpi(epi);
		
		// Faz uma requisição POST para a API, enviando o objeto Epi normalizado e retornando um Observable do objeto Epi criado
		return this.http.post<Epi>(this.apiUrl, payload);
	}
}
