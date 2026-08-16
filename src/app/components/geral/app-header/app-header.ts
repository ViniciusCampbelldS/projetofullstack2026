import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { AuthService } from '../../../service/auth';
import { NotificacaoService } from '../../../service/notificacao';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {

  notificacoesAbertas = false;
  configuracaoAberta = false;

  diasAvisoEpi: number;
  diasAvisoNr: number;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificacaoService: NotificacaoService,
  ) {
    this.diasAvisoEpi =
      this.notificacaoService.obterDiasAvisoEpi();

    this.diasAvisoNr =
      this.notificacaoService.obterDiasAvisoNr();
  }

  get userInitials(): string {
    return this.isEmployeePage
      ? 'JP'
      : 'AM';
  }

  get userName(): string {
    return this.isEmployeePage
      ? 'João Pedro'
      : 'Arthur Moretti';
  }

  get userRole(): string {
    return this.isEmployeePage
      ? 'Funcionário'
      : 'Diretor';
  }

  /*
   * Depois vamos trocar esse 0
   * pela quantidade real de EPIs e NRs
   * próximos do vencimento.
   */
  get totalNotificacoes(): number {
    return 0;
  }

  alternarNotificacoes(): void {
    this.notificacoesAbertas =
      !this.notificacoesAbertas;

    if (!this.notificacoesAbertas) {
      this.configuracaoAberta = false;
    }
  }

  alternarConfiguracao(): void {
    this.configuracaoAberta =
      !this.configuracaoAberta;
  }

  salvarConfiguracao(): void {

    if (
      this.diasAvisoEpi < 0 ||
      this.diasAvisoNr < 0
    ) {
      return;
    }

    this.notificacaoService
      .salvarDiasAvisoEpi(
        this.diasAvisoEpi
      );

    this.notificacaoService
      .salvarDiasAvisoNr(
        this.diasAvisoNr
      );

    this.configuracaoAberta = false;
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  private get isEmployeePage(): boolean {
    return this.router.url.includes(
      '/funcionario'
    );
  }
}
