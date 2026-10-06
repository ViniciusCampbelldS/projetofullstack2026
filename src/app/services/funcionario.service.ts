import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Funcionario } from '../models/funcionario';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
	private readonly http = inject(HttpClient);
	private readonly apiFuncionarios = `${environment.apiUrl}/funcionarios`;

	listar(): Observable<Funcionario[]> {
		return this.http.get<Funcionario[]>(this.apiFuncionarios);
	}

	obter(id: number): Observable<Funcionario> {
		return this.http.get<Funcionario>(`${this.apiFuncionarios}/${id}`);
	}

	cadastrar(funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
		return this.http.post<Funcionario>(this.apiFuncionarios, funcionario);
	}

	atualizar(id: number, funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
		return this.http.put<Funcionario>(`${this.apiFuncionarios}/${id}`, funcionario);
	}

	alterar(id: number, funcionario: Partial<Omit<Funcionario, 'id'>>): Observable<Funcionario> {
		return this.http.patch<Funcionario>(`${this.apiFuncionarios}/${id}`, funcionario);
	}

	excluir(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiFuncionarios}/${id}`);
	}
}