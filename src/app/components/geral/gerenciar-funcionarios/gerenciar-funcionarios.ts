import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth';

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
export class GerenciarFuncionarios {
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

  funcionarios: Funcionario[] = [
    {
      id: 1,
      matricula: '1001',
      nome: 'João Pedro da Rocha',
      cpf: '123.456.789-10',
      setor: 'Operações',
      cargo: 'Operador',
      perfil: 'Funcionário',
      status: 'Ativo',
      nrs: [
        'NR 06 - Equipamentos de Proteção Individual (EPI)',
        'NR 12 - Segurança no Trabalho em Máquinas e Equipamentos',
      ],
    },
    {
      id: 2,
      matricula: '1002',
      nome: 'Fernanda Lima Barreto',
      cpf: '987.654.321-00',
      setor: 'Qualidade',
      cargo: 'Supervisor',
      perfil: 'Técnico de Segurança do Trabalho',
      status: 'Ativo',
      nrs: [
        'NR 06 - Equipamentos de Proteção Individual (EPI)',
        'NR 35 - Trabalho em Altura',
      ],
    },
    {
      id: 3,
      matricula: '1003',
      nome: 'Marcos Paulo Pereira',
      cpf: '456.789.123-44',
      setor: 'Manutenção',
      cargo: 'Eletricista',
      perfil: 'Funcionário',
      status: 'Afastado',
      nrs: [
        'NR 06 - Equipamentos de Proteção Individual (EPI)',
        'NR 10 - Segurança em Instalações e Serviços em Eletricidade',
        'NR 35 - Trabalho em Altura',
      ],
    },
    {
      id: 4,
      matricula: '1004',
      nome: 'Ana Costa',
      cpf: '321.654.987-22',
      setor: 'Administrativo',
      cargo: 'Técnico de Segurança',
      perfil: 'Técnico de Segurança do Trabalho',
      status: 'Ativo',
      nrs: [
        'NR 06 - Equipamentos de Proteção Individual (EPI)',
        'NR 33 - Segurança e Saúde no Trabalho em Espaços Confinados',
      ],
    },
  ];

  form: FuncionarioForm = this.criarFormVazio();

  constructor(private readonly authService: AuthService) {}

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
    if (!this.funcionarioStatusSelecionado || !this.statusTemporario) {
      return;
    }

    this.funcionarios = this.funcionarios.map((funcionario) =>
      funcionario.id === this.funcionarioStatusSelecionado?.id
        ? { ...funcionario, status: this.statusTemporario as FuncionarioStatus }
        : funcionario
    );

    this.fecharModalStatus();
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.nrBusca = '';
  }

  salvarFuncionario(): void {
    if (!this.form.nome.trim() || !this.form.cpf.trim()) {
      return;
    }

    if (this.funcionarioEditandoId) {
      this.funcionarios = this.funcionarios.map((funcionario) =>
        funcionario.id === this.funcionarioEditandoId
          ? { ...funcionario, ...this.form, nrs: [...this.form.nrs] }
          : funcionario
      );
    } else {
      const proximoId = Math.max(...this.funcionarios.map((funcionario) => funcionario.id), 0) + 1;
      this.funcionarios = [
        ...this.funcionarios,
        {
          id: proximoId,
          matricula: this.gerarMatricula(proximoId),
          status: 'Ativo',
          ...this.form,
          nrs: [...this.form.nrs],
        },
      ];
    }

    this.fecharModal();
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
