import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Nr, NrRequest } from '../models/nr';

@Injectable({ providedIn: 'root' })
export class NrService {
	private readonly http = inject(HttpClient);
	private readonly apiNrs = `${environment.apiUrl}/nrs`;

	listar(): Observable<Nr[]> {
		return this.http.get<Nr[]>(this.apiNrs);
	}

	cadastrar(request: NrRequest): Observable<Nr> {
		return this.http.post<Nr>(this.apiNrs, request);
	}

	atualizar(id: number, request: NrRequest): Observable<Nr> {
		return this.http.put<Nr>(`${this.apiNrs}/${id}`, request);
	}

	excluir(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiNrs}/${id}`);
	}
}