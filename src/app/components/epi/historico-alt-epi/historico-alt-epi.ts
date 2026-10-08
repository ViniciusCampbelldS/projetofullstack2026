import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HistoryEntry } from '../epi.models';
import { EpiService } from '../../../services/epi.service';

@Component({
  selector: 'app-historico-alt-epi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-alt-epi.html',
  styleUrl: './historico-alt-epi.scss',
})
export class HistóricoAltEpi {
  history: HistoryEntry[] = [];
  errorMessage = '';

  constructor(private readonly epiService: EpiService) {
    this.epiService.listarEntregas().subscribe({
      next: (entregas) => this.history = entregas.map((item) => ({
        data: new Date(`${item.dataEntrega}T12:00:00`).toLocaleDateString('pt-BR'),
        usuario: 'MAR',
        registro: `EPI #${item.epiId} — CA ${item.ca}`,
        alteracao: 'Entrega registrada',
        detalhe: `${item.epi} vinculado a ${item.funcionario}`,
      })),
      error: () => this.errorMessage = 'Não foi possível buscar as entregas.',
    });
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
