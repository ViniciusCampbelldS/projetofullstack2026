import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificacaoService } from '../../../services/notificacao';

interface LoginResponse {
  access_token?: string;
  role?: 'Técnico de Segurança do Trabalho' | 'Funcionário';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  cpf = '';
  senha = '';

  erroLogin = false;
  mensagemErroLogin = 'CPF ou senha inválidos.';
  exibirTelefoneTI = false;
  carregando = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificacao: NotificacaoService,
  ) {}

  entrar(): void {
    if (this.carregando) {
      return;
    }

    this.erroLogin = false;
    this.mensagemErroLogin = 'CPF ou senha inválidos.';
    this.carregando = true;

    const cpfSemFormatacao = this.cpf.replace(/\D/g, '');

    this.authService
      .login({
        email: cpfSemFormatacao,
        senha: this.senha,
      })
      .subscribe({
        next: (response: LoginResponse) => {
          const token = response.access_token;

          if (!token) {
            this.mensagemErroLogin = 'CPF ou senha inválidos.';
            this.erroLogin = true;
            this.carregando = false;
            return;
          }

          this.authService.salvarToken(token);
          if (!response.role) {
            this.erroLogin = true;
            this.mensagemErroLogin = 'O servidor não informou o perfil de acesso.';
            this.carregando = false;
            this.authService.logout();
            return;
          }
          this.authService.salvarPerfil(response.role);
          this.notificacao.carregarEpis().subscribe({ error: () => {} });
          this.notificacao.carregarRegrasAviso().subscribe({ error: () => {} });

          this.router
            .navigateByUrl('/')
            .catch(() => {
              this.erroLogin = true;
            })
            .finally(() => {
              this.carregando = false;
            });
        },
        error: () => {
          this.mensagemErroLogin = 'Não foi possível conectar ao servidor de login.';
          this.erroLogin = true;
          this.carregando = false;
        },
      });
  }

  mostrarTelefoneTI(): void {
    this.exibirTelefoneTI = !this.exibirTelefoneTI;
  }
}
