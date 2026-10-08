// Injeta o serviço HTTP do Angular.
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Funcionario } from '../models/funcionario';

/*
 * Serviço responsável por todas as operações
 * de funcionários contra a API Java.
 */
@Injectable({ providedIn: 'root' })
export class FuncionarioService {
	/*
	 * HttpClient utilizado para acessar a API.
	 */
	private readonly http = inject(HttpClient);
	/*
	 * URL base do recurso de funcionários.
	 *
	 * Em desenvolvimento:
	 * http://localhost:8080/funcionarios
	 *
	 * Em produção:
	 * https://tst-java-db-access-api.onrender.com/funcionarios
	*/
	private readonly apiFuncionarios = `${environment.apiUrl}/funcionarios`;

	/*
	 * GET /funcionarios
	 *
	 * Lista todos os funcionários.
	 */
	listar(): Observable<Funcionario[]> {
		return this.http.get<Funcionario[]>(this.apiFuncionarios);
	}

	/*
	 * GET /funcionarios/{id}
	 *
	 * Busca um funcionário específico.
	 */
	obter(id: number): Observable<Funcionario> {
		return this.http.get<Funcionario>(`${this.apiFuncionarios}/${id}`);
	}

	/*
	 * POST /funcionarios
	 *
	 * Cadastra um novo funcionário.
	 */
	cadastrar(funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
		return this.http.post<Funcionario>(this.apiFuncionarios, funcionario);
	}

	// PUT /funcionarios/{id}
	// Atualiza o funcionário completo utilizando PATCH.
	// Este método será utilizado pelo CRUD principal.
	atualizar(
		id: number,
		funcionario: Partial<Omit<Funcionario, 'id'>>
	): Observable<Funcionario> {

		return this.http.patch<Funcionario>(
			`${this.apiFuncionarios}/${id}`,
			funcionario
		);
	}
	/*
	 * DELETE /funcionarios/{id}
	 *
	 * Exclui o funcionário.
	 */
	excluir(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiFuncionarios}/${id}`);
	}
}