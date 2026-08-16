import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { HeroAdministrativo } from './hero-administrativo/hero-administrativo';
import { PainelConformidade } from './painel-conformidade/painel-conformidade';
import { PainelPendencias } from './painel-pendencias/painel-pendencias';

@Component({
  selector: 'app-painel-administrativo',
  standalone: true,
  imports: [CommonModule, HeroAdministrativo, PainelConformidade, PainelPendencias],
  templateUrl: './painel-administrativo.html',
  styleUrl: './painel-administrativo.scss',
})
export class PainelAdministrativo {
  dataHoje = input.required<string>();
  saudacao = input.required<string>();
  percentualEpisValidos = input.required<number>();
  possuiDadosTreinamento = input.required<boolean>();
  totalEpis = input.required<number>();
  episEmDia = input.required<any[]>();
  episProximos = input.required<any[]>();
  episVencidos = input.required<any[]>();
  episDentroDaValidade = input.required<any[]>();
  totalPendencias = input.required<number>();
  mensagemPrioridade = input.required<string>();
  episComNotificacao = input.required<any[]>();
  estaVencido = input.required<(epi: any) => boolean>();
  textoVencimento = input.required<(epi: any) => string>();
}
