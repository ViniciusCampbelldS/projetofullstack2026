import { Component } from '@angular/core';
import { HistoricoLista } from '../../historico/historico-lista';

@Component({
  selector: 'app-historico-treinamento',
  standalone: true,
  imports: [HistoricoLista],
  templateUrl: './historico-treinamento.html',
  styleUrl: './historico-treinamento.scss',
})
export class HistoricoTreinamento {
  readonly areas = ['TURMA', 'NR', 'NOTIFICACAO_TREINAMENTO'];
}