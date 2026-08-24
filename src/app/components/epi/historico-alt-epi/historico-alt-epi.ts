import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HistoryEntry } from '../epi.models';
import { EpiService } from '../../../services/epi-service';

@Component({
  selector: 'app-historico-alt-epi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-alt-epi.html',
  styleUrl: './historico-alt-epi.scss',
})
export class HistóricoAltEpi {
  history: HistoryEntry[];

  constructor(private readonly epiService: EpiService) {
    this.history = this.epiService.getHistory().map((item, index) =>
      index === 2
        ? {
            ...item,
            alteracao: 'Manual',
            detalhe: 'EPI marcado como substituído pois não será mais exigido para o funcionário.',
          }
        : item
    );
  }

  getActionClass(alteracao: string): 'success' | 'warning' | 'danger' {
    const normalizedAction = alteracao.toLowerCase();

    if (normalizedAction.includes('entrega')) {
      return 'success';
    }

    if (normalizedAction.includes('altera') || normalizedAction.includes('manual')) {
      return 'warning';
    }

    return 'danger';
  }
}
