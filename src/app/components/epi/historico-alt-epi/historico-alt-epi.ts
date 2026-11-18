import { Component } from '@angular/core';
import { HistoricoLista } from '../../historico/historico-lista';

@Component({
  selector: 'app-historico-alt-epi',
  standalone: true,
  imports: [HistoricoLista],
  templateUrl: './historico-alt-epi.html',
  styleUrl: './historico-alt-epi.scss',
})
export class HistóricoAltEpi {
  readonly areas = ['EPI', 'NOTIFICACAO_EPI'];
}