import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface EmployeeTraining {
  id: number;
  nr: string;
  trainingDate: string;
  dueDate: string;
}

@Component({
  selector: 'app-meus-treinamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-treinamentos.html',
  styleUrl: './meus-treinamentos.scss',
})
export class MeusTreinamentos {
  readonly employeeTrainings: EmployeeTraining[] = [
    {
      id: 1,
      nr: 'NR 06',
      trainingDate: '05/08/2026',
      dueDate: '05/08/2027',
    },
    {
      id: 2,
      nr: 'NR 10',
      trainingDate: '11/04/2026',
      dueDate: '11/04/2028',
    },
    {
      id: 3,
      nr: 'NR 35',
      trainingDate: '20/08/2025',
      dueDate: '20/08/2026',
    },
  ];

  situacaoTreinamento(treinamento: EmployeeTraining): string {
    const vencimento = this.dataBrParaDate(treinamento.dueDate);
    const hoje = this.inicioDoDia(new Date());
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 30);

    if (vencimento < hoje) {
      return 'Vencido';
    }

    if (vencimento <= limite) {
      return 'Próximo do vencimento';
    }

    return 'Ativo';
  }

  classeTreinamento(treinamento: EmployeeTraining): string {
    const situacao = this.situacaoTreinamento(treinamento);

    if (situacao === 'Vencido') {
      return 'danger';
    }

    if (situacao === 'Próximo do vencimento') {
      return 'warning';
    }

    return 'good';
  }

  private dataBrParaDate(data: string): Date {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  private inicioDoDia(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
}
