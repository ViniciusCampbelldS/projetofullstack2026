import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-funcionario-portal',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <section class="funcionario-portal">
      <router-outlet></router-outlet>
    </section>
  `,
  styles: [`
    :host,
    .funcionario-portal {
      display: block;
      min-width: 0;
      background: var(--mar-bg);
    }
  `],
})
export class FuncionarioPortal {}
