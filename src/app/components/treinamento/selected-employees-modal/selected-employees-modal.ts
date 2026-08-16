import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuncionarioTreinamento } from '../employee-selector-modal/employee-selector-modal';

@Component({
  selector: 'app-selected-employees-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-employees-modal.html',
  styleUrl: './selected-employees-modal.scss'
})
export class SelectedEmployeesModal {
  @Input() isOpen = false;
  @Input() titulo = 'Funcionarios selecionados';
  @Input() funcionarios: FuncionarioTreinamento[] = [];
  @Input() allowRemove = false;
  @Input() emptyMessage = 'Nenhum funcionario selecionado.';
  @Output() close = new EventEmitter<void>();
  @Output() remove = new EventEmitter<number>();

  fechar(): void {
    this.close.emit();
  }

  remover(funcionarioId: number): void {
    this.remove.emit(funcionarioId);
  }

  formatarFuncionario(funcionario: FuncionarioTreinamento): string {
    return `${funcionario.nome} - ${funcionario.cpf} - ${funcionario.cargo} - ${funcionario.area}`;
  }
}
