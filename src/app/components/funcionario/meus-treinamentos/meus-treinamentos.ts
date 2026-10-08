import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TreinamentoService } from '../../../services/treinamento.service';

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
export class MeusTreinamentos implements OnInit {
  employeeTrainings: EmployeeTraining[] = [];
  errorMessage = '';
  loading = true;

  constructor(private readonly treinamentos: TreinamentoService) {}

  ngOnInit(): void {
    this.treinamentos.listarMeus().subscribe({
      next: (dados) => {
        const formato = (data?: string) => data ? new Date(`${data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR') : '—';
        this.employeeTrainings = dados.map((item) => ({
          id: item.id,
          nr: item.tipo,
          trainingDate: formato(item.aplicacao),
          dueDate: formato(item.vencimento),
        }));
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Não foi possível carregar seus treinamentos.'; this.loading = false; },
    });
  }

  situacaoTreinamento(treinamento: EmployeeTraining): string {
    if (treinamento.dueDate === '—') return 'Sem data informada';
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
