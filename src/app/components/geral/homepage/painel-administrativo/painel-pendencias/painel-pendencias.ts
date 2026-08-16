import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-painel-pendencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-pendencias.html',
  styleUrl: './painel-pendencias.scss',
})
export class PainelPendencias {
  totalPendencias = input.required<number>();
  mensagemPrioridade = input.required<string>();
  episComNotificacao = input.required<any[]>();
  estaVencido = input.required<(epi: any) => boolean>();
  textoVencimento = input.required<(epi: any) => string>();
}
