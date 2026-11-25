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
import { NrTreinamento, ParticipacaoTreinamento, TreinamentoService } from '../../../services/treinamento.service';
import { NotificacaoService } from '../../../services/notificacao';

type SituacaoTreinamento = SituacaoTreinamentoModal;

interface TreinamentoRegistro {
  id: number;
  nrId: number;
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
  nrs: NrTreinamento[] = [];
  nrSelecionadoId: number | null = null;
  novaData = new Date().toISOString().slice(0, 10);
  novoHorario = '08:00';
  salvandoTurma = false;
  carregandoTreinamentos = false;
  erroTreinamentos = '';
  filtroId = '';
  filtroNrId: number | null = null;
  filtroData = '';
  filtroSituacao = '';

  readonly situacoes: SituacaoTreinamento[] = ['Em dia', 'Proximo do vencimento', 'Vencido'];

  constructor(
    private readonly authService: AuthService,
    private readonly funcionarioService: FuncionarioService,
    private readonly treinamentoService: TreinamentoService,
    private readonly notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarTreinamentos();
    this.carregarNrs();
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

  carregarNrs(): void {
    this.treinamentoService.listar().subscribe({
      next: (nrs) => this.nrs = nrs,
      error: () => this.erroTreinamentos = 'Não foi possível carregar o lista de NRs.',
    });
  }

  get totalTurmas(): number { return this.treinamentos.length; }

  get turmasAgendadas(): number { const hoje=this.hojeLocal(); return this.treinamentos.filter(t=>t.aplicacao>hoje).length; }

  get participacoesProximas(): number { return this.treinamentos.flatMap(t=>t.participantes).filter(p=>p.presente&&p.validadeMeses>0&&this.diasAteVencimento(p)>=0&&this.diasAteVencimento(p)<=this.notificacaoService.obterDiasAviso(String(p.nrId),true)).length; }

  get participacoesVencidas(): number { return this.treinamentos.flatMap(t=>t.participantes).filter(p=>p.presente&&p.validadeMeses>0&&this.diasAteVencimento(p)<0).length; }

  private diasAteVencimento(p: ParticipacaoTreinamento): number { const d=new Date(`${this.somarMeses(p.data,p.validadeMeses)}T12:00:00`);const h=new Date();h.setHours(0,0,0,0);d.setHours(0,0,0,0);return Math.floor((d.getTime()-h.getTime())/86400000); }

  private hojeLocal(): string { const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

  get treinamentosFiltrados(): TreinamentoRegistro[] {
    return this.treinamentos.filter((item) =>
      (!this.filtroId || String(item.id).includes(this.filtroId)) &&
      (!this.filtroData || item.aplicacao === this.filtroData) &&
      (this.filtroNrId === null || item.nrId === this.filtroNrId) &&
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
          return { id, nrId: primeira.nrId, nr: `NR-${String(primeira.nrId).padStart(2, '0')}`, treinamento: primeira.nrNome,
            funcionario: itens.map((item) => item.funcionario).join(', '), aplicacao: primeira.data,
            vencimento, situacao: this.situacao(vencimento, primeira.nrId), participantes: itens };
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

    const nr = this.nrs.find((item) => item.id === this.treinamentoEditando!.nrId);
    if (!nr) { this.mensagem = 'NR não encontrada.'; return; }
    this.treinamentoService.atualizarValidade(nr, this.mesesEntre(this.formTreinamento.aplicacao, this.formTreinamento.vencimento)).subscribe({next:()=>{this.mensagem='Treinamento atualizado.';this.fecharEdicaoTreinamento();this.carregarTreinamentos();},error:()=>this.mensagem='Não foi possível salvar o treinamento.'});
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
    if (!this.nrSelecionadoId || this.selectedFuncionarioIds.size === 0 || !this.novaData || !this.novoHorario) {
      this.mensagem = 'Selecione NR, funcionários, data e horário para criar a turma.';
      return;
    }
    this.salvandoTurma = true;
    this.treinamentoService.criarTurma({
      nrId: this.nrSelecionadoId, data: this.novaData, horario: this.novoHorario, funcionarioIds: [...this.selectedFuncionarioIds],
    }).subscribe({
      next: () => {
        this.mensagem = 'Turma criada e participantes registrados.';
        this.selectedFuncionarioIds = new Set();
                this.salvandoTurma = false;
        this.carregarTreinamentos();
      },
      error: () => { this.mensagem = 'Não foi possível criar a turma.'; this.salvandoTurma = false; },
    });

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
  private situacao(vencimento:string,nrId:number):SituacaoTreinamento { if(!vencimento)return 'Em dia';const data=new Date(`${vencimento}T12:00:00`);if(Number.isNaN(data.getTime()))return 'Em dia';const hoje=new Date();hoje.setHours(0,0,0,0);data.setHours(0,0,0,0);const dias=Math.floor((data.getTime()-hoje.getTime())/86400000);return dias<0?'Vencido':dias<=this.notificacaoService.obterDiasAviso(String(nrId),true)?'Proximo do vencimento':'Em dia'; }
}
