import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-painel-conformidade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-conformidade.html',
  styleUrl: './painel-conformidade.scss',
})
export class PainelConformidade {
  percentualEpisValidos = input.required<number>();
  possuiDadosTreinamento = input.required<boolean>();
  totalEpis = input.required<number>();
  episEmDia = input.required<any[]>();
  episProximos = input.required<any[]>();
  episVencidos = input.required<any[]>();
  episDentroDaValidade = input.required<any[]>();
}
