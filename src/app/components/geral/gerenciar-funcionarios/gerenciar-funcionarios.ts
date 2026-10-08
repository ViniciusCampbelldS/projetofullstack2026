import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from '../../../services/funcionario.service';
import type { Funcionario as FuncionarioApi } from '../../../models/funcionario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';

type FuncionarioStatus = 'Ativo' | 'Afastado' | 'Inativo';

interface Funcionario {
  id: number;
  matricula: string;
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
  perfil: 'Funcionário' | 'Técnico de Segurança do Trabalho';
  status: FuncionarioStatus;
  nrs: string[];
}

interface FuncionarioForm {
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
  perfil: Funcionario['perfil'];
  nrs: string[];
}

@Component({
  selector: 'app-gerenciar-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-funcionarios.html',
  styleUrl: './gerenciar-funcionarios.scss',
})
export class GerenciarFuncionarios implements OnInit {
  readonly setores = ['Operações', 'Manutenção', 'Produção', 'Qualidade', 'Logística', 'Administrativo'];
  readonly cargos = ['Operador', 'Soldador', 'Eletricista', 'Supervisor', 'Auxiliar', 'Técnico de Segurança'];
  readonly perfis: Funcionario['perfil'][] = ['Funcionário', 'Técnico de Segurança do Trabalho'];
  readonly statusOptions: FuncionarioStatus[] = ['Ativo', 'Afastado', 'Inativo'];
  readonly nrOptions = [
    'NR 01 - Disposições gerais',
    'NR 02 - Inspeção prévia (Revogada)',
    'NR 03 - Comissão Interna de Prevenção de Acidentes (CIPA)',
    'NR 04 - Serviços Especializados em Engenharia de Segurança e em Medicina do Trabalho (SESMT)',
    'NR 05 - Comissão Interna de Prevenção de Acidentes',
    'NR 06 - Equipamentos de Proteção Individual (EPI)',
    'NR 07 - Programa de Controle Médico de Saúde Ocupacional (PCMSO)',
    'NR 08 - Edificações',
    'NR 09 - Programa de Prevenção de Riscos Ambientais (PPRA)',
    'NR 10 - Segurança em Instalações e Serviços em Eletricidade',
    'NR 11 - Transporte, Movimentação, Armazenagem e Manuseio de Materiais',
    'NR 12 - Segurança no Trabalho em Máquinas e Equipamentos',
    'NR 13 - Caldeiras, Vasos de Pressão e Tubulações',
    'NR 14 - Fornos',
    'NR 15 - Atividades e Operações Insalubres',
    'NR 16 - Atividades e Operações Perigosas',
    'NR 17 - Ergonomia',
    'NR 18 - Condições e Meio Ambiente de Trabalho na Indústria da Construção',
    'NR 19 - Explosivos',
    'NR 20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis',
    'NR 21 - Trabalho a Céu Aberto',
    'NR 22 - Mineração',
    'NR 23 - Proteção Contra Incêndios',
    'NR 24 - Condições Sanitárias e de Conforto nos Locais de Trabalho',
    'NR 25 - Resíduos Industriais',
    'NR 26 - Sinalização de Segurança',
    'NR 27 - Registro Profissional do Técnico de Segurança (Revogada)',
    'NR 28 - Fiscalização e Penalidades',
    'NR 29 - Segurança e Saúde no Trabalho Portuário',
    'NR 30 - Segurança e Saúde no Trabalho Aquaviário',
    'NR 31 - Segurança e Saúde no Trabalho na Agricultura, Pecuária, Silvicultura, Exploração Florestal e Aquicultura',
    'NR 32 - Segurança e Saúde no Trabalho em Serviços de Saúde',
    'NR 33 - Segurança e Saúde no Trabalho em Espaços Confinados',
    'NR 34 - Condições e Meio Ambiente de Trabalho na Indústria de Construção Naval',
    'NR 35 - Trabalho em Altura',
    'NR 36 - Segurança e Saúde no Trabalho em Empresas de Abate e Processamento de Carnes e Derivados',
    'NR 37 - Plataformas de Petróleo',
    'NR 38 - Limpeza Urbana e Manejo de Resíduos Sólidos',
  ];

  filtroBusca = '';
  filtroSetor = '';
  filtroCargo = '';
  filtroStatus = '';
  nrBusca = '';

  modalAberto = false;
  modalStatusAberto = false;
  funcionarioEditandoId: number | null = null;
  funcionarioStatusSelecionado: Funcionario | null = null;
  statusTemporario: FuncionarioStatus | null = null;

  funcionarios: Funcionario[] = [];
  carregando = true;
  erro = '';

  form: FuncionarioForm = this.criarFormVazio();

  constructor(private readonly authService: AuthService, private readonly api: FuncionarioService) {}

  ngOnInit(): void { this.carregarFuncionarios(); }

  private carregarFuncionarios(): void {
    this.carregando = true;
    this.erro = '';
    this.api.listar().subscribe({
      next: (registros) => {
        this.funcionarios = registros.map((f) => this.mapear(f));
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Não foi possível consultar os funcionários. Verifique sua conexão.';
      },
    });
  }

  private mapear(f: FuncionarioApi): Funcionario {
    return {
      id: f.id,
      matricula: this.gerarMatricula(f.id),
      nome: f.nome,
      cpf: f.cpf,
      setor: f.setor,
      cargo: f.cargo,
      perfil: f.permicoes === 'tst' || f.permicoes === 'ADM' ? 'Técnico de Segurança do Trabalho' : 'Funcionário',
      status: f.status === 'Af' ? 'Afastado' : f.status === 'In' ? 'Inativo' : 'Ativo',
      nrs: (f.nRs ?? []).map((nr) => this.nrOptions.find((op) => op.startsWith(nr.replace('-', ' '))) ?? nr),
    };
  }

  private prepararPayload(form: FuncionarioForm, status: FuncionarioStatus): Omit<FuncionarioApi, 'id'> {
    return {
      nome: form.nome.trim(),
      cpf: form.cpf.replace(/\D/g, ''),
      cargo: form.cargo,
      setor: form.setor,
      permicoes: form.perfil === 'Técnico de Segurança do Trabalho' ? 'tst' : 'field',
      status: status === 'Afastado' ? 'Af' : status === 'Inativo' ? 'In' : 'At',
      nRs: form.nrs.map((nr) => nr.slice(0, 5).replace('-', ' ')),
    };
  }

  get podeGerenciarFuncionarios(): boolean {
    return this.authService.podeCadastrarFuncionario();
  }

  get perfilAtual(): string {
    return this.authService.obterPerfil();
  }

  get funcionariosFiltrados(): Funcionario[] {
    const busca = this.filtroBusca.trim().toLowerCase();

    return this.funcionarios.filter((funcionario) => {
      const correspondeBusca =
        !busca ||
        funcionario.nome.toLowerCase().includes(busca) ||
        funcionario.cpf.toLowerCase().includes(busca) ||
        funcionario.cargo.toLowerCase().includes(busca);

      const correspondeSetor = !this.filtroSetor || funcionario.setor === this.filtroSetor;
      const correspondeCargo = !this.filtroCargo || funcionario.cargo === this.filtroCargo;
      const correspondeStatus = !this.filtroStatus || funcionario.status === this.filtroStatus;

      return correspondeBusca && correspondeSetor && correspondeCargo && correspondeStatus;
    });
  }

  get totalAtivos(): number {
    return this.funcionarios.filter((funcionario) => funcionario.status === 'Ativo').length;
  }

  get totalAfastados(): number {
    return this.funcionarios.filter((funcionario) => funcionario.status === 'Afastado').length;
  }

  get totalComNr(): number {
    return this.funcionarios.filter((funcionario) => funcionario.nrs.length > 0).length;
  }

  get nrOptionsFiltradas(): string[] {
    const busca = this.nrBusca.trim().toLowerCase();

    return this.nrOptions.filter((nr) => {
      const naoSelecionada = !this.form.nrs.includes(nr);
      const correspondeBusca = !busca || nr.toLowerCase().includes(busca);

      return naoSelecionada && correspondeBusca;
    });
  }

  abrirNovoFuncionario(): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.funcionarioEditandoId = null;
    this.form = this.criarFormVazio();
    this.nrBusca = '';
    this.modalAberto = true;
  }

  editarFuncionario(funcionario: Funcionario): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.funcionarioEditandoId = funcionario.id;
    this.form = {
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      setor: funcionario.setor,
      cargo: funcionario.cargo,
      perfil: funcionario.perfil,
      nrs: [...funcionario.nrs],
    };
    this.nrBusca = '';
    this.modalAberto = true;
  }

  abrirModalStatus(funcionario: Funcionario): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.funcionarioStatusSelecionado = funcionario;
    this.statusTemporario = funcionario.status;
    this.modalStatusAberto = true;
  }

  selecionarStatusTemporario(status: FuncionarioStatus): void {
    this.statusTemporario = status;
  }

  fecharModalStatus(): void {
    this.modalStatusAberto = false;
    this.funcionarioStatusSelecionado = null;
    this.statusTemporario = null;
  }

  salvarAlteracaoStatus(): void {
    if (!this.funcionarioStatusSelecionado || !this.statusTemporario) return;
    const f = this.funcionarioStatusSelecionado;
    const novoStatus = this.statusTemporario;
    this.erro = '';
    this.api.alterar(f.id, { status: novoStatus === 'Afastado' ? 'Af' : novoStatus === 'Inativo' ? 'In' : 'At' }).subscribe({
      next: (atualizado) => {
        this.funcionarios = this.funcionarios.map((item) => item.id === atualizado.id ? this.mapear(atualizado) : item);
        this.fecharModalStatus();
      },
      error: () => { this.erro = 'Não foi possível atualizar o status no servidor.'; },
    });
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.nrBusca = '';
  }

  salvarFuncionario(): void {
    if (!this.form.nome.trim() || this.form.cpf.replace(/\D/g, '').length !== 11) {
      this.erro = 'Informe nome e CPF com 11 dígitos.';
      return;
    }
    this.erro = '';
    const existente = this.funcionarios.find((f) => f.id === this.funcionarioEditandoId);
    const payload = this.prepararPayload(this.form, existente?.status ?? 'Ativo');
    const request = this.funcionarioEditandoId
      ? this.api.atualizar(this.funcionarioEditandoId, payload)
      : this.api.cadastrar(payload);
    request.subscribe({
      next: (salvo) => {
        this.funcionarios = this.funcionarios.filter((f) => f.id !== salvo.id).concat(this.mapear(salvo));
        this.fecharModal();
      },
      error: () => { this.erro = 'Falha ao salvar. Verifique os campos e tente novamente.'; },
    });
  }

  limparFiltros(): void {
    this.filtroBusca = '';
    this.filtroSetor = '';
    this.filtroCargo = '';
    this.filtroStatus = '';
  }

  selecionarNr(nr: string): void {
    if (this.form.nrs.includes(nr)) {
      return;
    }

    this.form.nrs = [...this.form.nrs, nr];
    this.nrBusca = '';
  }

  removerNr(nr: string): void {
    this.form.nrs = this.form.nrs.filter((item) => item !== nr);
  }

  statusClass(status: FuncionarioStatus): string {
    if (status === 'Ativo') {
      return 'status-active';
    }

    if (status === 'Afastado') {
      return 'status-away';
    }

    return 'status-inactive';
  }

  formatarCpfTabela(cpf: string): string {
    const digitos = cpf.replace(/\D/g, '').slice(0, 11);

    if (digitos.length !== 11) {
      return cpf;
    }

    return digitos.replace(/(\d{2})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3-$4');
  }

  private criarFormVazio(): FuncionarioForm {
    return {
      nome: '',
      cpf: '',
      setor: 'Operações',
      cargo: 'Operador',
      perfil: 'Funcionário',
      nrs: [],
    };
  }

  private gerarMatricula(id: number): string {
    return String(1000 + id);
  }
}
