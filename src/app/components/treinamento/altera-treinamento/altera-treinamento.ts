import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { FuncionarioStatus } from '../../../models/funcionario';
import { FuncionarioService } from '../../../services/funcionario.service';
import {
  EditarTreinamentoModal,
  SituacaoTreinamentoModal,
  TreinamentoRegistroModal,
} from '../editar-treinamento-modal/editar-treinamento-modal';
import { EmployeeSelectorModal, FuncionarioTreinamento } from '../employee-selector-modal/employee-selector-modal';
import { SelectedEmployeesModal } from '../selected-employees-modal/selected-employees-modal';
import { CursoTreinamento, ParticipacaoTreinamento, TreinamentoService } from '../../../services/treinamento.service';

type SituacaoTreinamento = SituacaoTreinamentoModal;

interface TreinamentoRegistro {
  id: number;
  cursoId: number;
  nr: string;
  treinamento: string;
  funcionario: string;
  aplicacao: string;
  vencimento: string;
  situacao: SituacaoTreinamento;
  participantes: ParticipacaoTreinamento[];
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
  carregandoFuncionarios = false;
  erroFuncionarios = '';

  treinamentos: TreinamentoRegistro[] = [];
  cursos: CursoTreinamento[] = [];
  cursoSelecionadoId: number | null = null;
  novoNrId: number | null = null;
  novoNome = '';
  novaValidadeMeses = 12;
  novaData = new Date().toISOString().slice(0, 10);
  novoHorario = '08:00';
  salvandoTurma = false;
  carregandoTreinamentos = false;
  erroTreinamentos = '';
  filtroId = '';
  filtroNome = '';
  filtroData = '';
  filtroNr = '';
  filtroSituacao = '';

  readonly situacoes: SituacaoTreinamento[] = ['Em dia', 'Proximo do vencimento', 'Vencido'];

  constructor(
    private readonly authService: AuthService,
    private readonly funcionarioService: FuncionarioService,
    private readonly treinamentoService: TreinamentoService
  ) {}

  ngOnInit(): void {
    this.carregarTreinamentos();
    this.carregarCursos();
    this.carregandoFuncionarios = true;
    this.erroFuncionarios = '';

    this.funcionarioService.listar().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios.map((funcionario) => ({
          id: funcionario.id,
          nome: funcionario.nome,
          cpf: funcionario.cpf,
          cargo: funcionario.cargo,
          area: funcionario.setor,
          status: this.statusParaTela(funcionario.status),
        }));
        this.carregandoFuncionarios = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar funcionários para treinamentos:', erro);
        this.funcionarios = [];
        this.erroFuncionarios = 'Não foi possível carregar os funcionários.';
        this.carregandoFuncionarios = false;
      },
    });
  }

  carregarCursos(): void {
    this.treinamentoService.listar().subscribe({
      next: (cursos) => this.cursos = cursos,
      error: () => this.erroTreinamentos = 'Não foi possível carregar o catálogo de treinamentos.',
    });
  }

  get treinamentosFiltrados(): TreinamentoRegistro[] {
    const nome = this.filtroNome.trim().toLocaleLowerCase('pt-BR');
    return this.treinamentos.filter((item) =>
      (!this.filtroId || String(item.id).includes(this.filtroId)) &&
      (!nome || item.treinamento.toLocaleLowerCase('pt-BR').includes(nome)) &&
      (!this.filtroData || item.aplicacao === this.filtroData) &&
      (!this.filtroNr || item.nr === this.filtroNr) &&
      (!this.filtroSituacao || item.situacao === this.filtroSituacao));
  }

  carregarTreinamentos(): void {
    this.carregandoTreinamentos = true;
    this.erroTreinamentos = '';
    this.treinamentoService.turmas().subscribe({
      next: (registros) => {
        const grupos = new Map<number, ParticipacaoTreinamento[]>();
        for (const registro of registros) grupos.set(registro.id, [...(grupos.get(registro.id) ?? []), registro]);
        this.treinamentos = [...grupos.entries()].map(([id, itens]) => {
          const primeira = itens[0];
          const vencimento = primeira.presente ? this.somarMeses(primeira.data, primeira.validadeMeses) : '';
          return { id, cursoId: primeira.treinamentoId, nr: `NR-${String(primeira.nrId).padStart(2, '0')}`, treinamento: primeira.treinamento,
            funcionario: itens.map((item) => item.funcionario).join(', '), aplicacao: primeira.data,
            vencimento, situacao: this.situacao(vencimento), participantes: itens };
        });
        this.carregandoTreinamentos = false;
      },
      error: () => { this.erroTreinamentos = 'Não foi possível carregar os treinamentos.'; this.carregandoTreinamentos = false; },
    });
  }

  private statusParaTela(status: string): FuncionarioStatus {
    switch (status) {
      case 'Af':
        return 'Afastado';
      case 'In':
        return 'Inativo';
      default:
        return 'Ativo';
    }
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
    if (!this.podeEditarTreinamento || !this.treinamentoEditando) {
      return;
    }

    const nrId = Number(this.formTreinamento.nr.replace(/\D/g, ''));
    this.treinamentoService.atualizar(this.treinamentoEditando.cursoId, {
      nrId, nome: this.formTreinamento.treinamento, validadeMeses: this.mesesEntre(this.formTreinamento.aplicacao, this.formTreinamento.vencimento),
    }).subscribe({next:()=>{this.mensagem='Treinamento atualizado.';this.fecharEdicaoTreinamento();this.carregarTreinamentos();},error:()=>this.mensagem='Não foi possível salvar o treinamento.'});
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
    if (!this.podeEditarTreinamento || this.salvandoTurma) return;
    if (this.selectedFuncionarioIds.size === 0 || !this.novaData || !this.novoHorario) {
      this.mensagem = 'Selecione funcionários, data e horário para criar a turma.';
      return;
    }
    this.salvandoTurma = true;
    const criarTurma = (cursoId: number) => this.treinamentoService.criarTurma({
      treinamentoId: cursoId, data: this.novaData, horario: this.novoHorario, funcionarioIds: [...this.selectedFuncionarioIds],
    }).subscribe({
      next: () => {
        this.mensagem = 'Turma criada e participantes registrados.';
        this.selectedFuncionarioIds = new Set();
        this.cursoSelecionadoId = cursoId;
        this.salvandoTurma = false;
        this.carregarCursos();
        this.carregarTreinamentos();
      },
      error: () => { this.mensagem = 'Não foi possível criar a turma.'; this.salvandoTurma = false; },
    });

    if (this.cursoSelecionadoId) {
      criarTurma(this.cursoSelecionadoId);
      return;
    }
    if (!this.novoNrId || !this.novoNome.trim() || this.novaValidadeMeses < 1) {
      this.mensagem = 'Escolha um curso existente ou informe NR, nome e validade para criar um novo.';
      this.salvandoTurma = false;
      return;
    }
    this.treinamentoService.criar({ nrId: this.novoNrId, nome: this.novoNome.trim(), validadeMeses: this.novaValidadeMeses })
      .subscribe({ next: (curso) => criarTurma(curso.id), error: () => { this.mensagem = 'Não foi possível criar o treinamento.'; this.salvandoTurma = false; } });
  }

  atualizarPresenca(turma: TreinamentoRegistro, participante: ParticipacaoTreinamento, presente: boolean): void {
    if (!this.podeEditarTreinamento) return;
    this.treinamentoService.atualizarPresenca(turma.id, participante.funcionarioId, presente).subscribe({
      next: () => this.carregarTreinamentos(),
      error: () => this.mensagem = 'Não foi possível atualizar a presença.',
    });
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

  private somarMeses(data: string, meses: number): string { const d=new Date(`${data}T12:00:00`);d.setMonth(d.getMonth()+meses);return d.toISOString().slice(0,10); }
  private mesesEntre(inicio:string,fim:string):number { const a=new Date(`${inicio}T12:00:00`),b=new Date(`${fim}T12:00:00`);return Math.max(1,(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth()); }
  private situacao(vencimento:string):SituacaoTreinamento { if(!vencimento)return 'Vencido';const dias=(new Date(`${vencimento}T12:00:00`).getTime()-Date.now())/86400000;return dias<0?'Vencido':dias<30?'Proximo do vencimento':'Em dia'; }
}
