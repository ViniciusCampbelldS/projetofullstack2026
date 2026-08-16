import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SituacaoTreinamentoModal = 'Em dia' | 'Proximo do vencimento' | 'Vencido';

export interface TreinamentoRegistroModal {
  id: number;
  nr: string;
  treinamento: string;
  funcionario: string;
  aplicacao: string;
  vencimento: string;
  situacao: SituacaoTreinamentoModal;
}

@Component({
  selector: 'app-editar-treinamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-treinamento-modal.html',
  styleUrl: './editar-treinamento-modal.scss'
})
export class EditarTreinamentoModal {
  @Input() isOpen = false;
  @Input({ required: true }) formTreinamento!: TreinamentoRegistroModal;
  @Input() situacoes: SituacaoTreinamentoModal[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
