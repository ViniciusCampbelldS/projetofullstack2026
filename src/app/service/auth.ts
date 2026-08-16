import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';

export type UserRole = 'Técnico de Segurança do Trabalho' | 'Funcionário';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private readonly roleKey = 'userRole';

  constructor(private http: HttpClient) {}

  login(dados: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, dados).pipe(
      timeout(8000),
    );
  }

  salvarToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  salvarPerfil(perfil: UserRole) {
    sessionStorage.setItem(this.roleKey, perfil);
  }

  obterToken() {
    return sessionStorage.getItem('token');
  }

  obterPerfil(): UserRole {
    const perfil = sessionStorage.getItem(this.roleKey) as UserRole | null;
    return perfil ?? 'Técnico de Segurança do Trabalho';
  }

  podeEditarEpi(): boolean {
    return this.obterPerfil() === 'Técnico de Segurança do Trabalho';
  }

  podeEditarTreinamento(): boolean {
    return this.obterPerfil() === 'Técnico de Segurança do Trabalho';
  }

  podeCadastrarFuncionario(): boolean {
    return this.obterPerfil() === 'Técnico de Segurança do Trabalho';
  }

  apenasVisualizacao(): boolean {
    return this.obterPerfil() === 'Funcionário';
  }

  isAuthenticated(): boolean {
    return !!this.obterToken();
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem(this.roleKey);
  }
}
