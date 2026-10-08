import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TreinamentoService, TreinamentoApi } from '../../../services/treinamento.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
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
export class AlteraTreinamento implements OnInit {
  isEditModalOpen = false;
  isEmployeeModalOpen = false;
  isSelectedEmployeesModalOpen = false;
  mensagem = '';

  treinamentoEditando: TreinamentoRegistro | null = null;
  formTreinamento: TreinamentoRegistroModal = this.criarTreinamentoVazio();
  selectedFuncionarioIds = new Set<number>();

  funcionarios: FuncionarioTreinamento[] = [];
  treinamentos: TreinamentoRegistro[] = [];
  carregando = false;
  filtroId = '';
  filtroTreinamento = '';
  filtroData = '';
  filtroVencimento = '';
  filtroNr = '';
  filtroSituacao = '';

  get treinamentosFiltrados(): TreinamentoRegistro[] {
    return this.treinamentos.filter((t) =>
      (!this.filtroId || String(t.id).includes(this.filtroId.trim())) &&
      (!this.filtroTreinamento || t.treinamento.toLocaleLowerCase().includes(this.filtroTreinamento.toLocaleLowerCase())) &&
      (!this.filtroData || t.aplicacao === this.filtroData) &&
      (!this.filtroVencimento || t.vencimento === this.filtroVencimento) &&
      (!this.filtroNr || t.nr === this.filtroNr) &&
      (!this.filtroSituacao || t.situacao === this.filtroSituacao));
  }
  limparFiltros(): void {
    this.filtroId = this.filtroTreinamento = this.filtroData = this.filtroVencimento = this.filtroNr = this.filtroSituacao = '';
  }
  get totalAgendados(): number { return this.treinamentos.filter((t) => !!t.aplicacao && t.aplicacao > new Date().toISOString().slice(0, 10)).length; }
  get totalProximos(): number { return this.treinamentos.filter((t) => t.situacao === 'Proximo do vencimento').length; }
  get totalVencidos(): number { return this.treinamentos.filter((t) => t.situacao === 'Vencido').length; }

  readonly situacoes: SituacaoTreinamento[] = ['Em dia', 'Proximo do vencimento', 'Vencido'];

  constructor(
    private readonly authService: AuthService,
    private readonly api: TreinamentoService,
    private readonly funcionariosApi: FuncionarioService,
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.api.listar().subscribe({
      next: (items) => { this.treinamentos = items.map((item) => this.mapearTreinamento(item)); this.carregando = false; },
      error: () => { this.mensagem = 'Não foi possível carregar os treinamentos.'; this.carregando = false; },
    });
    this.funcionariosApi.listar().subscribe({
      next: (items) => { this.funcionarios = items.map((f) => ({
        id: f.id, nome: f.nome, cpf: f.cpf, cargo: f.cargo, area: f.setor,
      })); },
      error: () => { this.mensagem = 'Funcionários indisponíveis para seleção.'; },
    });
  }

  private mapearTreinamento(t: TreinamentoApi): TreinamentoRegistro {
    return {
      id: t.id, nr: t.tipo, treinamento: t.nome, funcionario: t.funcionario || 'Não vinculado',
      aplicacao: t.aplicacao || '', vencimento: t.vencimento || '',
      situacao: (this.situacoes.includes(t.situacao as SituacaoTreinamento) ? t.situacao : 'Em dia') as SituacaoTreinamento,
    };
  }

  private prepararTreinamento(form: TreinamentoRegistroModal) {
    return {
      nome: form.treinamento.trim(), tipo: form.nr.trim(),
      funcionario: form.funcionario.trim(), aplicacao: form.aplicacao || undefined,
      vencimento: form.vencimento || undefined, situacao: form.situacao,
    };
  }


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
    if (!this.formTreinamento.treinamento.trim() || !this.formTreinamento.nr.trim()) {
      this.mensagem = 'Informe o nome e o código da NR.';
      return;
    }
    const body = this.prepararTreinamento(this.formTreinamento);
    const request = this.treinamentoEditando
      ? this.api.atualizar(this.treinamentoEditando.id, body)
      : this.api.cadastrar(body);
    request.subscribe({
      next: (salvo) => {
        this.treinamentos = [this.mapearTreinamento(salvo), ...this.treinamentos.filter((t) => t.id !== salvo.id)];
        this.mensagem = 'Treinamento salvo no servidor.';
        this.fecharEdicaoTreinamento();
      },
      error: () => { this.mensagem = 'Não foi possível salvar o treinamento no servidor.'; },
    });
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
    if (!this.podeEditarTreinamento) return;
    this.treinamentoEditando = null;
    this.formTreinamento = {
      ...this.criarTreinamentoVazio(),
      funcionario: this.funcionariosSelecionadosNomes,
    };
    this.isEditModalOpen = true;
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
