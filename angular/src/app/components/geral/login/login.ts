import { Component } from '@angular/core';
import { AuthService, UserRole } from '../../../service/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token?: string;
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
  perfil: UserRole = 'Técnico de Segurança do Trabalho';
  readonly perfis: UserRole[] = ['Técnico de Segurança do Trabalho', 'Funcionário'];

  erroLogin = false;
  mensagemErroLogin = 'CPF ou senha inválidos.';
  exibirTelefoneTI = false;
  carregando = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
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
          this.authService.salvarPerfil(this.perfil);

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
