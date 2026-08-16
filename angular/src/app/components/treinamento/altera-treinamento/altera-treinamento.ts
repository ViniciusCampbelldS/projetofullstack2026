import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth';
import {
  EditarTreinamentoModal,
  SituacaoTreinamentoModal,
  TreinamentoRegistroModal,
} from '../editar-treinamento-modal/editar-treinamento-modal';
import { EmployeeSelectorModal, FuncionarioTreinamento } from '../employee-selector-modal/employee-selector-modal';
import { SelectedEmployeesModal } from '../selected-employees-modal/selected-employees-modal';

type SituacaoTreinamento = SituacaoTreinamentoModal;

interface TreinamentoRegistro {
  id: number;
  nr: string;
  treinamento: string;
  funcionario: string;
  aplicacao: string;
  vencimento: string;
  situacao: SituacaoTreinamento;
}

@Component({
  selector: 'app-altera-treinamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EditarTreinamentoModal, EmployeeSelectorModal, SelectedEmployeesModal],
  templateUrl: './altera-treinamento.html',
  styleUrl: './altera-treinamento.scss'
})
export class AlteraTreinamento {
  isEditModalOpen = false;
  isEmployeeModalOpen = false;
  isSelectedEmployeesModalOpen = false;
  mensagem = '';

  treinamentoEditando: TreinamentoRegistro | null = null;
  formTreinamento: TreinamentoRegistroModal = this.criarTreinamentoVazio();
  selectedFuncionarioIds = new Set<number>();

  readonly funcionarios: FuncionarioTreinamento[] = [
    { id: 1, nome: 'Pedro Henrique', cpf: '354.287.696-10', cargo: 'Tecnico de Seguranca', area: 'Operacoes' },
    { id: 2, nome: 'Joao da Silva', cpf: '875.143.220-41', cargo: 'Eletricista', area: 'Manutencao' },
    { id: 3, nome: 'Carlos Oliveira', cpf: '192.334.870-55', cargo: 'Operador', area: 'Producao' },
    { id: 4, nome: 'Fernanda Lima', cpf: '621.904.118-83', cargo: 'Supervisora', area: 'Qualidade' },
    { id: 5, nome: 'Ana Costa', cpf: '448.072.561-09', cargo: 'Auxiliar', area: 'Logistica' },
    { id: 6, nome: 'Marcos Pereira', cpf: '903.655.412-77', cargo: 'Soldador', area: 'Metalurgia' },
  ];

  treinamentos: TreinamentoRegistro[] = [
    {
      id: 1,
      nr: 'NR-35',
      treinamento: 'Trabalho em Altura',
      funcionario: 'Pedro Henrique',
      aplicacao: '2026-08-20',
      vencimento: '2027-08-20',
      situacao: 'Em dia',
    },
    {
      id: 2,
      nr: 'NR-10',
      treinamento: 'Seguranca em Eletricidade',
      funcionario: 'Joao da Silva',
      aplicacao: '2026-08-10',
      vencimento: '2026-09-10',
      situacao: 'Proximo do vencimento',
    },
    {
      id: 3,
      nr: 'NR-12',
      treinamento: 'Seguranca em Maquinas',
      funcionario: 'Carlos Oliveira',
      aplicacao: '2025-05-05',
      vencimento: '2026-05-05',
      situacao: 'Vencido',
    },
  ];

  readonly situacoes: SituacaoTreinamento[] = ['Em dia', 'Proximo do vencimento', 'Vencido'];

  constructor(private readonly authService: AuthService) {}

  get podeEditarTreinamento(): boolean {
    return this.authService.podeEditarTreinamento();
  }

  get perfilAtual(): string {
    return this.authService.obterPerfil();
  }

  get funcionariosSelecionadosNomes(): string {
    return this.funcionarios
      .filter((funcionario) => this.selectedFuncionarioIds.has(funcionario.id))
      .map((funcionario) => funcionario.nome)
      .join(', ');
  }

  get funcionariosSelecionados(): FuncionarioTreinamento[] {
    return this.funcionarios.filter((funcionario) => this.selectedFuncionarioIds.has(funcionario.id));
  }

  abrirEdicaoTreinamento(treinamento: TreinamentoRegistro): void {
    if (!this.podeEditarTreinamento) {
      this.mensagem = `Perfil ${this.perfilAtual} possui apenas visualizacao administrativa de treinamentos.`;
      return;
    }

    this.treinamentoEditando = treinamento;
    this.formTreinamento = { ...treinamento };
    this.isEditModalOpen = true;
  }

  fecharEdicaoTreinamento(): void {
    this.isEditModalOpen = false;
    this.treinamentoEditando = null;
    this.formTreinamento = this.criarTreinamentoVazio();
  }

  salvarEdicaoTreinamento(): void {
    if (!this.treinamentoEditando) {
      return;
    }

    this.treinamentos = this.treinamentos.map((treinamento) =>
      treinamento.id === this.treinamentoEditando?.id
        ? { ...this.formTreinamento }
        : treinamento
    );

    this.mensagem = 'Treinamento atualizado localmente no frontend.';
    this.fecharEdicaoTreinamento();
  }

  abrirModalFuncionarios(): void {
    this.isEmployeeModalOpen = true;
  }

  fecharModalFuncionarios(): void {
    this.isEmployeeModalOpen = false;
  }

  abrirModalFuncionariosSelecionados(): void {
    this.isSelectedEmployeesModalOpen = true;
  }

  fecharModalFuncionariosSelecionados(): void {
    this.isSelectedEmployeesModalOpen = false;
  }

  salvarFuncionariosSelecionados(funcionarioIds: number[]): void {
    this.selectedFuncionarioIds = new Set(funcionarioIds);
    this.fecharModalFuncionarios();
  }

  removerFuncionarioSelecionado(funcionarioId: number): void {
    this.selectedFuncionarioIds = new Set(
      [...this.selectedFuncionarioIds].filter((id) => id !== funcionarioId)
    );
  }

  adicionarNovoTreinamento(): void {
    const funcionarios = this.funcionariosSelecionadosNomes || 'Funcionarios nao vinculados';
    const proximoId = Math.max(...this.treinamentos.map((treinamento) => treinamento.id), 0) + 1;

    this.treinamentos = [
      {
        id: proximoId,
        nr: 'NR-00',
        treinamento: 'Nova turma aberta',
        funcionario: funcionarios,
        aplicacao: '2026-08-14',
        vencimento: '2027-08-14',
        situacao: 'Em dia',
      },
      ...this.treinamentos,
    ];

    this.mensagem = 'Novo treinamento/turma adicionado localmente a tabela.';
  }

  situacaoClass(situacao: SituacaoTreinamento): string {
    if (situacao === 'Vencido') {
      return 'danger';
    }

    if (situacao === 'Proximo do vencimento') {
      return 'warning';
    }

    return 'good';
  }

  private criarTreinamentoVazio(): TreinamentoRegistroModal {
    return {
      id: 0,
      nr: '',
      treinamento: '',
      funcionario: '',
      aplicacao: '',
      vencimento: '',
      situacao: 'Em dia',
    };
  }
}
