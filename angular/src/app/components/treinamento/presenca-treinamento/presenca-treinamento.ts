import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeSelectorModal, FuncionarioTreinamento } from '../employee-selector-modal/employee-selector-modal';
import { SelectedEmployeesModal } from '../selected-employees-modal/selected-employees-modal';

interface TurmaTreinamento {
  id: number;
  treinamento: string;
  data: string;
  horario: string;
  participantes: string[];
  documento: string;
}

@Component({
  selector: 'app-abre-treinamento',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSelectorModal, SelectedEmployeesModal],
  templateUrl: './presenca-treinamento.html',
  styleUrl: './presenca-treinamento.scss'
})
export class PresencaTreinamento {
  readonly funcionarios: FuncionarioTreinamento[] = [
    { id: 1, nome: 'Pedro Henrique', cpf: '354.287.696-10', cargo: 'Tecnico de Seguranca', area: 'Operacoes' },
    { id: 2, nome: 'Joao da Silva', cpf: '875.143.220-41', cargo: 'Eletricista', area: 'Manutencao' },
    { id: 3, nome: 'Carlos Oliveira', cpf: '192.334.870-55', cargo: 'Operador', area: 'Producao' },
    { id: 4, nome: 'Fernanda Lima', cpf: '621.904.118-83', cargo: 'Supervisora', area: 'Qualidade' },
    { id: 5, nome: 'Ana Costa', cpf: '448.072.561-09', cargo: 'Auxiliar', area: 'Logistica' },
    { id: 6, nome: 'Marcos Pereira', cpf: '903.655.412-77', cargo: 'Soldador', area: 'Metalurgia' },
  ];

  treinamento = '';
  data = '';
  horario = '';
  filtroTurmaData = '';
  filtroTurmaHorario = '';
  participantes: string[] = [];
  documento = '';
  documentoPreviewUrl = '';
  mensagem = '';
  turmaSelecionadaId: number | null = 1;
  isEmployeeModalOpen = false;
  isSelectedEmployeesModalOpen = false;
  selectedFuncionarioIds = new Set<number>([1, 3]);

  turmas: TurmaTreinamento[] = [
    {
      id: 1,
      treinamento: 'NR-35 - Trabalho em Altura',
      data: '2026-08-20',
      horario: '08:00',
      participantes: ['Pedro Henrique', 'Carlos Oliveira'],
      documento: 'lista-presenca-nr35.pdf',
    },
    {
      id: 2,
      treinamento: 'NR-10 - Seguranca em Eletricidade',
      data: '2026-08-12',
      horario: '14:00',
      participantes: ['Joao da Silva', 'Ana Costa'],
      documento: 'lista-presenca-nr10.pdf',
    },
    {
      id: 3,
      treinamento: 'NR-12 - Seguranca em Maquinas',
      data: '2026-08-22',
      horario: '09:30',
      participantes: ['Fernanda Lima', 'Marcos Pereira'],
      documento: 'lista-presenca-nr12.pdf',
    },
  ];

  constructor() {
    const turmaInicial = this.turmaSelecionada;

    if (turmaInicial) {
      this.selecionarTurma(turmaInicial);
    }
  }

  get podeCriar(): boolean {
    return Boolean(this.treinamento && this.data && this.horario && this.participantes.length > 0);
  }

  get filteredTurmas(): TurmaTreinamento[] {
    return this.turmas.filter((turma) => {
      const matchData = !this.filtroTurmaData || turma.data === this.filtroTurmaData;
      const matchHorario = !this.filtroTurmaHorario || turma.horario === this.filtroTurmaHorario;

      return matchData && matchHorario;
    });
  }

  get turmaSelecionada(): TurmaTreinamento | null {
    return this.turmas.find((turma) => turma.id === this.turmaSelecionadaId) ?? null;
  }

  get funcionariosSelecionados(): FuncionarioTreinamento[] {
    return this.funcionarios.filter((funcionario) => this.selectedFuncionarioIds.has(funcionario.id));
  }

  obterStatusTurma(turma: TurmaTreinamento): 'Planejada' | 'Realizada' {
    const dataHoraTurma = new Date(`${turma.data}T${turma.horario}:00`);
    const agora = new Date();

    return dataHoraTurma < agora ? 'Realizada' : 'Planejada';
  }

  selecionarTurma(turma: TurmaTreinamento): void {
    this.turmaSelecionadaId = turma.id;
    this.treinamento = turma.treinamento;
    this.data = turma.data;
    this.horario = turma.horario;
    this.participantes = [...turma.participantes];
    this.selectedFuncionarioIds = new Set(
      this.funcionarios
        .filter((funcionario) => turma.participantes.includes(funcionario.nome))
        .map((funcionario) => funcionario.id)
    );
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
    this.sincronizarParticipantes();
    this.fecharModalFuncionarios();
  }

  removerParticipante(funcionarioId: number): void {
    this.selectedFuncionarioIds = new Set(
      [...this.selectedFuncionarioIds].filter((id) => id !== funcionarioId)
    );
    this.sincronizarParticipantes();
  }

  onDocumentoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (this.documentoPreviewUrl) {
      URL.revokeObjectURL(this.documentoPreviewUrl);
    }

    this.documento = file.name;
    this.documentoPreviewUrl = URL.createObjectURL(file);
  }

  criarTurma(): void {
    if (!this.podeCriar) {
      const camposFaltantes = [
        !this.treinamento ? 'treinamento' : '',
        !this.data ? 'data' : '',
        !this.horario ? 'horario' : '',
        this.participantes.length === 0 ? 'ao menos um funcionario' : '',
      ].filter(Boolean);

      this.mensagem = 'Preencha: ' + camposFaltantes.join(', ') + '.';
      return;
    }

    this.turmas = [
      {
        id: Math.max(...this.turmas.map((turma) => turma.id), 0) + 1,
        treinamento: this.treinamento,
        data: this.data,
        horario: this.horario,
        participantes: [...this.participantes],
        documento: this.documento || 'Documento pendente',
      },
      ...this.turmas,
    ];

    this.mensagem = 'Presenca registrada localmente no frontend.';
  }

  private sincronizarParticipantes(): void {
    this.participantes = this.funcionariosSelecionados.map((funcionario) => funcionario.nome);
  }
}
