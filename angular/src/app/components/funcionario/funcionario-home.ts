import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="funcionario-home">
      <div class="home-heading">
        <h1>Minha área</h1>
        <p>Consulte seus equipamentos e treinamentos vinculados.</p>
      </div>

      <div class="portal-actions">
        <a class="portal-card" routerLink="/funcionario/meus-epis">
          <span class="portal-icon">
            <i class="bi bi-shield-check"></i>
          </span>
          <strong>Meus EPIs</strong>
          <small>Equipamentos recebidos, fichas e relato de estado.</small>
        </a>

        <a class="portal-card" routerLink="/funcionario/meus-treinamentos">
          <span class="portal-icon orange">
            <i class="bi bi-journal-check"></i>
          </span>
          <strong>Meus Treinamentos</strong>
          <small>NRs realizadas, datas de validade e vencimentos.</small>
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      padding: var(--mar-page-padding-top) var(--mar-page-padding-x) var(--mar-page-padding-bottom);
      background: var(--mar-bg);
    }

    .funcionario-home {
      display: grid;
      gap: 18px;
      max-width: 920px;
      margin: 0 auto;
    }

    .home-heading h1 {
      margin: 0;
      color: var(--mar-azul-escuro);
      font-size: clamp(1.7rem, 2.4vw, 2.25rem);
      font-weight: 800;
    }

    .home-heading p {
      margin: 6px 0 0;
      color: var(--mar-text-secondary);
      font-size: 0.92rem;
    }

    .portal-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .portal-card {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 8px 14px;
      min-height: 132px;
      padding: 18px;
      border: 1px solid var(--mar-line-soft);
      border-radius: var(--mar-radius-md);
      background: var(--mar-surface);
      box-shadow: var(--mar-shadow-soft);
      color: inherit;
      text-decoration: none;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .portal-card:hover {
      transform: translateY(-2px);
      border-color: rgba(4, 103, 158, 0.28);
    }

    .portal-icon {
      display: grid;
      grid-row: span 2;
      width: 52px;
      height: 52px;
      place-items: center;
      border-radius: 12px;
      background: rgba(4, 103, 158, 0.10);
      color: var(--mar-azul-medio);
      font-size: 22px;
    }

    .portal-icon.orange {
      background: rgba(246, 141, 23, 0.13);
      color: var(--mar-laranja-escuro);
    }

    .portal-card strong {
      align-self: end;
      color: var(--mar-azul-escuro);
      font-size: 1rem;
    }

    .portal-card small {
      color: var(--mar-text-secondary);
      font-size: 0.84rem;
      line-height: 1.45;
    }

    @media (max-width: 760px) {
      :host {
        padding: 22px 14px 42px;
      }

      .portal-actions {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class FuncionarioHome {}
