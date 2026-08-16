import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FuncionarioTreinamento {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  area: string;
}

@Component({
  selector: 'app-employee-selector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-selector-modal.html',
  styleUrl: './employee-selector-modal.scss'
})
export class EmployeeSelectorModal {
  @Input() isOpen = false;
  @Input() titulo = 'Adicionar funcionários';
  @Input() funcionarios: FuncionarioTreinamento[] = [];
  @Input() selectedFuncionarioIds = new Set<number>();
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number[]>();

  filtroCPF = '';
  filtroNome = '';
  filtroCargo = '';
  filtroArea = '';
  checkedFuncionarioIds = new Set<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFuncionarioIds'] || changes['isOpen']) {
      this.checkedFuncionarioIds = new Set(this.selectedFuncionarioIds);
    }
  }

  get filteredFuncionarios(): FuncionarioTreinamento[] {
    const cpf = this.filtroCPF.trim().toLowerCase();
    const nome = this.filtroNome.trim().toLowerCase();
    const cargo = this.filtroCargo.trim().toLowerCase();
    const area = this.filtroArea.trim().toLowerCase();

    return this.funcionarios.filter((funcionario) => {
      const matchCpf = !cpf || funcionario.cpf.toLowerCase().includes(cpf);
      const matchNome = !nome || funcionario.nome.toLowerCase().includes(nome);
      const matchCargo = !cargo || funcionario.cargo.toLowerCase().includes(cargo);
      const matchArea = !area || funcionario.area.toLowerCase().includes(area);

      return matchCpf && matchNome && matchCargo && matchArea;
    });
  }

  get allFilteredChecked(): boolean {
    return this.filteredFuncionarios.length > 0
      && this.filteredFuncionarios.every((funcionario) => this.checkedFuncionarioIds.has(funcionario.id));
  }

  get hasCheckedFuncionarios(): boolean {
    return this.checkedFuncionarioIds.size > 0;
  }

  fechar(): void {
    this.close.emit();
  }

  toggleFuncionarioChecked(funcionarioId: number, checked: boolean): void {
    const nextChecked = new Set(this.checkedFuncionarioIds);

    if (checked) {
      nextChecked.add(funcionarioId);
    } else {
      nextChecked.delete(funcionarioId);
    }

    this.checkedFuncionarioIds = nextChecked;
  }

  toggleAllFiltered(checked: boolean): void {
    const nextChecked = new Set(this.checkedFuncionarioIds);

    this.filteredFuncionarios.forEach((funcionario) => {
      if (checked) {
        nextChecked.add(funcionario.id);
      } else {
        nextChecked.delete(funcionario.id);
      }
    });

    this.checkedFuncionarioIds = nextChecked;
  }

  confirmarSelecao(): void {
    this.save.emit([...this.checkedFuncionarioIds]);
  }
}
