import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
// Importa o serviço que faz as requisições para a API Java.
import { FuncionarioService } from '../../../services/funcionario.service';
// Importa os tipos de status usados pelo filtro.
import { FuncionarioStatus, FuncionarioStatusFiltro } from '../../../models/funcionario';
import { Funcionario, FuncionarioRequest } from '../../../models/funcionario';
import { Nr, NrRequest } from '../../../models/nr';
import { NrService } from '../../../services/nr.service';
import { EpiService } from '../../../services/epi.service';
import { TreinamentoService } from '../../../services/treinamento.service';
import { forkJoin } from 'rxjs';

/*
 * Estrutura utilizada pelo formulário.
 *
 * O banco gerar o ID sozinho.
 */
interface FuncionarioForm {
 email: string;
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
  perfil: 'Funcionário' | 'Técnico de Segurança do Trabalho' | 'RH' | 'Gerência' | 'Administrador';
  nrs: string[];
}

/*
 * Componente responsável pela tela administrativa
 * de gerenciamento de funcionários.
 */
@Component({
  selector: 'app-gerenciar-funcionarios',

  // O componente continua sendo standalone.
  standalone: true,

  // FormsModule é necessário por causa do [(ngModel)].
  imports: [CommonModule, FormsModule],

  templateUrl: './gerenciar-funcionarios.html',
  styleUrl: './gerenciar-funcionarios.scss',
})
export class GerenciarFuncionarios implements OnInit {
  /*
   * Injeta o serviço responsável pela comunicação
   * com a API Java.
   */
  private readonly funcionarioService = inject(FuncionarioService);

  private readonly nrService = inject(NrService);
  private readonly epiService = inject(EpiService);
  private readonly treinamentoService = inject(TreinamentoService);
  indicadoresCarregando = true;
  indicadoresErro = '';
  private funcionariosEpiVencido = new Set<number>();
  private funcionariosTreinamentoVencido = new Set<number>();

  carregarIndicadores(): void {
    this.indicadoresCarregando = true;
    this.indicadoresErro = '';
    forkJoin({epis: this.epiService.listar(), treinamentos: this.treinamentoService.turmas()}).subscribe({
      next: ({epis, treinamentos}) => {
        if (treinamentos.some(t => !Object.prototype.hasOwnProperty.call(t, 'vencimento'))) {
          this.indicadoresErro = 'Atualize o backend para consultar a validade dos treinamentos.';
          this.indicadoresCarregando = false;
          return;
        }
        const hoje = new Date();
        const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`;
        this.funcionariosEpiVencido = new Set(epis.filter(e => !e.dataDescarte && !e.substituido && !!e.vencimento && e.vencimento.slice(0,10) < dataHoje).flatMap(e => (e.funcionarios ?? []).map(f => f.id)));
        this.funcionariosTreinamentoVencido = new Set(treinamentos.filter(t => t.presente && !!t.vencimento && t.vencimento.slice(0,10) < dataHoje).map(t => t.funcionarioId));
        this.indicadoresCarregando = false;
      },
      error: () => { this.indicadoresErro = 'Não foi possível carregar os indicadores de vencimento.'; this.indicadoresCarregando = false; },
    });
  }

  private contarElegiveis(ids: Set<number>): number {
    return this.funcionarios.filter(f => (f.status === 'At' || f.status === 'Af') && ids.has(f.id)).length;
  }
  get totalComEpiVencido(): number { return this.contarElegiveis(this.funcionariosEpiVencido); }
  get totalComTreinamentoVencido(): number { return this.contarElegiveis(this.funcionariosTreinamentoVencido); }

  /*
   * Injeta o serviço de autenticação para verificar
   * se o usuário possui permissão de edição.
   */
  private readonly authService = inject(AuthService);

  get setores(): string[] {
    return this.valoresCadastrados('setor');
  }

  get cargos(): string[] {
    return this.valoresCadastrados('cargo');
  }

  private valoresCadastrados(campo: 'setor' | 'cargo'): string[] {
    return [...new Set(this.funcionarios.map((funcionario) => funcionario[campo]?.trim()).filter((valor): valor is string => !!valor))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }
  /*
   * Perfis apresentados para o usuário.
   */
  readonly perfis: FuncionarioForm['perfil'][] = [
 'RH','Gerência','Administrador',
    'Funcionário',
    'Técnico de Segurança do Trabalho',
  ];

  /*
   * Status apresentados na interface.
   */
  readonly statusOptions: FuncionarioStatus[] = ['Ativo', 'Inativo', 'Afastado'];

  readonly statusFiltroOptions: FuncionarioStatusFiltro[] = [
    'Ativo',
    'Inativo',
    'Afastado',
    'Ativos e Afastados',
    'Todos',
  ];

  /*
   * NRs cadastradas na API Java.
   */
  nrs: Nr[] = [];
  nrCarregando = false;
  nrSalvando = false;
  nrErroCarregamento = '';
  nrErro = '';
  nrSucesso = '';
  nrEditandoId: number | null = null;
  senhaInicial="";
  erroSenha="";
  definirSenha(){if(!this.podeGerenciarPerfis||this.funcionarioEditandoId===null)return;this.funcionarioService.definirSenha(this.funcionarioEditandoId,this.senhaInicial).subscribe({next:()=>{this.senhaInicial="";this.erroSenha="Senha definida; sessões anteriores encerradas.";},error:()=>{this.erroSenha="Não foi possível definir a senha.";}});}
  nrNomeForm = '';

  /*
   * Funcionários carregados da API.
   */
  funcionarios: Funcionario[] = [];

  /*
   * Controla o carregamento inicial.
   */
  carregando = false;

  /*
   * Mensagem de erro exibida na tela.
   */
  erro = '';

  /*
   * Mensagem de sucesso.
   */
  sucesso = '';

  /*
   * Filtros da tabela.
   */
  filtroBusca = '';
  filtroSetor = '';
  filtroCargo = '';
  // Começa ocultando os funcionários inativos.
  filtroStatus: FuncionarioStatusFiltro = 'Ativos e Afastados';

  /*
   * Busca utilizada para encontrar NRs.
   */
  nrBusca = '';

  /*
   * Controla o modal de cadastro/edição.
   */
  modalAberto = false;

  /*
   * Controla o modal de alteração de status.
   */
  modalStatusAberto = false;

  /*
   * ID do funcionário atualmente sendo editado.
   *
   * null significa que estamos cadastrando um novo.
   */
  funcionarioEditandoId: number | null = null;

  /*
   * Funcionário selecionado para alteração de status.
   */
  funcionarioStatusSelecionado: Funcionario | null = null;

  /*
   * Status temporário escolhido no modal.
   */
  statusTemporario: FuncionarioStatus | null = null;

  /*
   * Funcionário selecionado para exclusão.
   */
  funcionarioExcluindo: Funcionario | null = null;

  /*
   * Formulário atualmente aberto.
   */
  form: FuncionarioForm = this.criarFormVazio();

  /*
   * Ao criar o componente, carrega os funcionários
   * diretamente do banco através da API Java.
   */
  ngOnInit(): void {
    this.carregarFuncionarios();
    this.carregarNrs();
    this.carregarIndicadores();
  }

  /*
   * Carrega o catálogo de NRs da API Java.
   */
  carregarNrs(): void {
    this.nrCarregando = true;
    this.nrErroCarregamento = '';

    this.nrService.listar().subscribe({
      next: (nrs) => {
        this.nrs = [...nrs].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        this.nrCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar NRs:', erro);
        this.nrErroCarregamento = 'Não foi possível carregar as NRs.';
        this.nrCarregando = false;
      },
    });
  }

  /*
   * Retorna true quando o usuário atual possui
   * permissão para administrar funcionários.
   */
  get podeGerenciarFuncionarios(): boolean {
    return this.authService.podeCadastrarFuncionario();
  }

  /*
   * Retorna o perfil atual do usuário.
   */
  get podeGerenciarNrs(){return this.authService.podeEditarTreinamento();}
  get podeGerenciarPerfis(){return ["Administrador","Gerência"].includes(this.authService.obterPerfil());}
  abrirCatalogoNr(){this.form=this.criarFormVazio();this.modalAberto=true;}

  get perfilAtual(): string {
    return this.authService.obterPerfil();
  }

  /*
   * Filtra os funcionários conforme os filtros
   * preenchidos na tela.
   */
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

      const statusFuncionario = this.statusParaTela(funcionario.status);

      let correspondeStatus = false;

      if (this.filtroStatus === 'Todos') {
        correspondeStatus = true;
      } else if (this.filtroStatus === 'Ativos e Afastados') {
        correspondeStatus = statusFuncionario === 'Ativo' || statusFuncionario === 'Afastado';
      } else {
        correspondeStatus = statusFuncionario === this.filtroStatus;
      }

      // Combina a busca textual com setor, cargo e status.
      return correspondeBusca && correspondeSetor && correspondeCargo && correspondeStatus;
    });
  }

  /*
   * Conta funcionários ativos.
   */
  get totalAtivos(): number {
    return this.funcionarios.filter((funcionario) => funcionario.status === 'At').length;
  }

  /*
   * Conta funcionários afastados.
   */
  get totalAfastados(): number {
    return this.funcionarios.filter((funcionario) => funcionario.status === 'Af').length;
  }

  /*
   * Conta funcionários que possuem pelo menos uma NR.
   */
  get totalComNr(): number {
    return this.funcionarios.filter((funcionario) => funcionario.nRs?.length > 0).length;
  }

  /*
   * Filtra as NRs disponíveis no autocomplete.
   */
  get nrOptionsFiltradas(): Nr[] {
    const busca = this.nrBusca.trim().toLowerCase();

    return this.nrs.filter((nr) => {
      const naoSelecionada = !this.form.nrs.includes(nr.nome);

      const correspondeBusca = !busca || nr.nome.toLowerCase().includes(busca);

      return naoSelecionada && correspondeBusca;
    });
  }

  /*
   * Busca todos os funcionários na API.
   */
  carregarFuncionarios(): void {
    this.carregando = true;
    this.erro = '';

    this.funcionarioService.listar().subscribe({
      next: (funcionarios) => {
        // Guarda os dados retornados pelo Java.
        this.funcionarios = funcionarios.map((funcionario) =>
          this.normalizarFuncionario(funcionario),
        );

        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar funcionários:', erro);

        this.erro = 'Não foi possível carregar os funcionários.';

        this.carregando = false;
      },
    });
  }

  /*
   * Abre o modal para cadastrar um novo funcionário.
   */
  abrirNovoFuncionario(): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.limparMensagens();

    this.funcionarioEditandoId = null;

    this.form = this.criarFormVazio();

    this.nrBusca = '';

    this.modalAberto = true;
  }

  /*
   * Abre o modal para editar um funcionário existente.
   */
  editarFuncionario(funcionario: Funcionario): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.limparMensagens();

    this.funcionarioEditandoId = funcionario.id;

    this.form = {
 email: funcionario.email ?? "",
      nome: funcionario.nome,

      cpf: funcionario.cpf,

      setor: funcionario.setor,

      cargo: funcionario.cargo,

      perfil: this.permissaoParaPerfil(funcionario.permissoes),

      nrs: [...(funcionario.nRs ?? [])],
    };

    this.nrBusca = '';

    this.modalAberto = true;
  }

  /*
   * Abre o modal para alterar o status.
   */
  abrirModalStatus(funcionario: Funcionario): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.funcionarioStatusSelecionado = funcionario;

    this.statusTemporario = this.statusParaTela(funcionario.status);

    this.modalStatusAberto = true;
  }

  /*
   * Seleciona um novo status temporário.
   */
  selecionarStatusTemporario(status: FuncionarioStatus): void {
    this.statusTemporario = status;
  }

  /*
   * Fecha o modal de status.
   */
  fecharModalStatus(): void {
    this.modalStatusAberto = false;

    this.funcionarioStatusSelecionado = null;

    this.statusTemporario = null;
  }

  /*
   * Salva somente a alteração de status através de PATCH.
   */
  salvarAlteracaoStatus(): void {
    if (!this.funcionarioStatusSelecionado || !this.statusTemporario) {
      return;
    }

    this.limparMensagens();

    const funcionario = this.funcionarioStatusSelecionado;

    const request = this.criarRequest(funcionario, this.statusTemporario);

    const novoStatus = this.statusParaApi(this.statusTemporario);

    this.carregando = true;

    this.funcionarioService.alterar(funcionario.id, { status: novoStatus }).subscribe({
      next: (atualizado) => {
        this.substituirFuncionario(atualizado);

        this.sucesso = 'Situação do funcionário alterada com sucesso.';

        this.carregando = false;

        this.fecharModalStatus();
      },

      error: (erro) => {
        console.error('Erro ao alterar status:', erro);

        this.erro = erro?.error?.message ?? 'Não foi possível alterar a situação do funcionário.';

        this.carregando = false;
      },
    });
  }
  /*
   * Fecha o modal de cadastro/edição.
   */
  fecharModal(): void {
    this.modalAberto = false;

    this.nrBusca = '';
  }

  /*
   * Salva um funcionário novo ou existente.
   */
  salvarFuncionario(): void {
    if (!this.form.nome.trim() || !this.form.cpf.trim()) {
      this.erro = 'Nome e CPF são obrigatórios.';

      return;
    }

    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    this.limparMensagens();

    /*
     * Quando estamos editando, reaproveitamos
     * o funcionário atual para manter o status.
     */
    const funcionarioAtual =
      this.funcionarioEditandoId !== null
        ? this.funcionarios.find((funcionario) => funcionario.id === this.funcionarioEditandoId)
        : undefined;

    const request = this.criarRequest(
      funcionarioAtual,
      funcionarioAtual ? this.statusParaTela(funcionarioAtual.status) : 'Ativo',
    );

    this.carregando = true;

    /*
     * Se existe ID, fazemos PUT.
     */
    if (this.funcionarioEditandoId !== null) {
      this.funcionarioService.atualizar(this.funcionarioEditandoId, request).subscribe({
        next: (funcionario) => {
          this.substituirFuncionario(funcionario);

          this.sucesso = 'Funcionário atualizado com sucesso.';

          this.carregando = false;

          this.fecharModal();
        },

        error: (erro) => {
          console.error('Erro ao atualizar funcionário:', erro);

          this.erro = 'Não foi possível atualizar o funcionário.';

          this.carregando = false;
        },
      });

      return;
    }

    /*
     * Caso não exista ID, fazemos POST.
     */
    this.funcionarioService.cadastrar(request).subscribe({
      next: (funcionario) => {
        this.funcionarios = [...this.funcionarios, this.normalizarFuncionario(funcionario)];

        this.sucesso = 'Funcionário cadastrado com sucesso.';

        this.carregando = false;

        this.fecharModal();
      },

      error: (erro) => {
        console.error('Erro ao cadastrar funcionário:', erro);

        this.erro = 'Não foi possível cadastrar o funcionário.';

        this.carregando = false;
      },
    });
  }

  /*
   * Exclui um funcionário através da API Java.
   */
  excluirFuncionario(funcionario: Funcionario): void {
    if (!this.podeGerenciarFuncionarios) {
      return;
    }

    /*
     * Confirmação simples para evitar exclusões acidentais.
     */
    const confirmar = window.confirm(`Deseja realmente excluir ${funcionario.nome}?`);

    if (!confirmar) {
      return;
    }

    this.limparMensagens();

    this.carregando = true;

    this.funcionarioService.excluir(funcionario.id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter((item) => item.id !== funcionario.id);

        this.sucesso = 'Funcionário excluído com sucesso.';

        this.carregando = false;
      },

      error: (erro) => {
        // Adicionado console.error para depuração
        console.error('Erro ao excluir funcionário:', erro);

        /*
         * O Java pode rejeitar a exclusão - Não deve ser implementado no java por enquanto.
         */
        this.erro = erro?.error?.message ?? 'Não foi possível excluir o funcionário.';
        // Garantir que o carregamento seja desativado mesmo em caso de erro
        this.carregando = false;
      },
    });
  }

  /*
   * Limpa todos os filtros da tabela.
   */
  limparFiltros(): void {
    this.filtroBusca = '';
    this.filtroSetor = '';
    this.filtroCargo = '';
    // Restaura o filtro de status para ocultar os funcionários inativos.
    this.filtroStatus = 'Ativos e Afastados';
  }

	/*
	 * Adiciona uma NR ao formulário.
	 */
	selecionarNr(nr: Nr): void {

		if (this.form.nrs.includes(nr.nome)) {
			return;
		}

		this.form.nrs = [
			...this.form.nrs,
			nr.nome,
		];

    this.nrBusca = '';
  }

	/*
	 * Prepara uma NR existente para edição.
	 */
	editarNr(nr: Nr): void {
 if(!this.podeGerenciarNrs)return;
		this.nrEditandoId = nr.id;
		this.nrNomeForm = nr.nome;
		this.nrErro = '';
		this.nrSucesso = '';
	}

	cancelarEdicaoNr(): void {
		this.nrEditandoId = null;
		this.nrNomeForm = '';
	}

	/*
	 * Cria ou atualiza uma NR no catálogo Java.
	 */
	salvarNr(): void {
 if(!this.podeGerenciarNrs)return;
		const nome = this.nrNomeForm.trim();

		if (!nome) {
			this.nrErro = 'Informe o nome da NR.';
			return;
		}

		if (nome.length > 250) {
			this.nrErro = 'O nome deve possuir no máximo 250 caracteres.';
			return;
		}

		const id = this.nrEditandoId;
		const duplicada = this.nrs.some(
			nr => nr.id !== id &&
				nr.nome.trim().toLocaleLowerCase() === nome.toLocaleLowerCase()
		);

		if (duplicada) {
			this.nrErro = 'Já existe uma NR com esse nome.';
			return;
		}

		this.nrErro = '';
		this.nrSucesso = '';
		this.nrSalvando = true;

		if(!/NR[\s-]*\d+/i.test(nome)){this.nrErro="Informe o número no nome, por exemplo NR 35 - Trabalho em altura.";this.nrSalvando=false;return;}
		const request: NrRequest = {
 id: this.nrEditandoId ?? Number(nome.match(/NR[\s-]*(\d+)/i)?.[1]), nome };
		const operacao = id === null
			? this.nrService.cadastrar(request)
			: this.nrService.atualizar(id, request);

		operacao.subscribe({
			next: nrSalva => {
				const nomeAnterior = this.nrs.find(
					nr => nr.id === nrSalva.id
				)?.nome;

				this.nrs = [
					...this.nrs.filter(nr => nr.id !== nrSalva.id),
					nrSalva,
				].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

				if (nomeAnterior) {
					this.form.nrs = this.form.nrs.map(
						nr => nr === nomeAnterior ? nrSalva.nome : nr
					);
				}

				this.nrSucesso = id === null
					? 'NR cadastrada com sucesso.'
					: 'NR atualizada com sucesso.';
				this.nrSalvando = false;
				this.cancelarEdicaoNr();
			},
			error: erro => {
				console.error('Erro ao salvar NR:', erro);
				this.nrErro = erro?.error?.message ??
					'Não foi possível salvar a NR.';
				this.nrSalvando = false;
			},
		});
	}

	/*
	 * Remove uma NR do catálogo Java.
	 */
	excluirNr(nr: Nr): void {
 if(!this.podeGerenciarNrs)return;
		if (!window.confirm(`Deseja realmente excluir a NR "${nr.nome}"?`)) {
			return;
		}

		this.nrErro = '';
		this.nrSucesso = '';
		this.nrSalvando = true;

		this.nrService.excluir(nr.id).subscribe({
			next: () => {
				this.nrs = this.nrs.filter(item => item.id !== nr.id);
				this.form.nrs = this.form.nrs.filter(nome => nome !== nr.nome);

				if (this.nrEditandoId === nr.id) {
					this.cancelarEdicaoNr();
				}

				this.nrSucesso = 'NR excluída com sucesso.';
				this.nrSalvando = false;
			},
			error: erro => {
				console.error('Erro ao excluir NR:', erro);
				this.nrErro = erro?.error?.message ??
					'Não foi possível excluir a NR.';
				this.nrSalvando = false;
			},
		});
	}

	/*
	 * Remove uma NR selecionada.
	 */
	removerNr(nr: string): void {

		this.form.nrs =
			this.form.nrs.filter(
				item => item !== nr
			);
	}

  /*
   * Retorna a classe CSS correspondente ao status.
   */
  statusClass(status: FuncionarioStatus): string {
    if (status === 'Ativo') {
      return 'status-active';
    }

    if (status === 'Afastado') {
      return 'status-away';
    }

    return 'status-inactive';
  }

  /*
   * Converte o status utilizado pelo Java
   * para o texto apresentado na tela.
   */
  statusParaTela(status: string): FuncionarioStatus {
    switch (status) {
      case 'Af':
        return 'Afastado';

      case 'In':
        return 'Inativo';

      case 'At':
      default:
        return 'Ativo';
    }
  }

  /*
   * Converte o perfil visual para a permissão
   * esperada pela API Java.
   */
  perfilParaPermissao(perfil: FuncionarioForm['perfil']):string {return ({'Técnico de Segurança do Trabalho':'tst','Funcionário':'field','RH':'rh','Gerência':'gerencia','Administrador':'ADM'} as Record<string,string>)[perfil]??'field';}

  /*
   * Converte a permissão do Java para o texto
   * mostrado no formulário.
   */
  permissaoParaPerfil(permissao:string):FuncionarioForm['perfil'] {return ({tst:'Técnico de Segurança do Trabalho',field:'Funcionário',rh:'RH',gerencia:'Gerência',ADM:'Administrador'} as Record<string,FuncionarioForm['perfil']>)[permissao]??'Funcionário';}

  /*
   * Converte o texto do status para o código
   * armazenado pela API.
   */
  statusParaApi(status: FuncionarioStatus): string {
    switch (status) {
      case 'Afastado':
        return 'Af';

      case 'Inativo':
        return 'In';

      case 'Ativo':
      default:
        return 'At';
    }
  }

  /*
   * Monta exatamente o payload esperado pelo Java.
   */
  private criarRequest(
    funcionarioAtual: Funcionario | undefined,
    status: FuncionarioStatus,
  ): FuncionarioRequest {
    return {
      nome: this.form.nome.trim(),
 email: this.form.email.trim() || null,

      cpf: this.form.cpf.replace(/\D/g, ''),

      setor: this.form.setor.trim(),

      cargo: this.form.cargo.trim(),

      permissoes: this.perfilParaPermissao(this.form.perfil),

      status: this.statusParaApi(status),

      nRs: [...this.form.nrs],
    };
  }

  /*
   * Substitui um funcionário existente
   * pelo objeto devolvido pela API.
   */
  private substituirFuncionario(funcionario: Funcionario): void {
    this.funcionarios = this.funcionarios.map((item) =>
      item.id === funcionario.id ? this.normalizarFuncionario(funcionario) : item,
    );
  }

  /*
   * Garante que listas vindas da API
   * nunca sejam undefined.
   */
  private normalizarFuncionario(funcionario: Funcionario): Funcionario {
    return {
      ...funcionario,

      nRs: funcionario.nRs ?? [],

      status: funcionario.status ?? 'At',

      permissoes: funcionario.permissoes ?? 'field',
    };
  }

  /*
   * Cria o formulário inicial.
   */
  private criarFormVazio(): FuncionarioForm {
    return {
      email: "",
      nome: '',

      cpf: '',

      setor: '',

      cargo: '',

      perfil: 'Funcionário',

      nrs: [],
    };
  }

  /*
   * Limpa mensagens de sucesso e erro.
   */
  private limparMensagens(): void {
    this.erro = '';
    this.sucesso = '';
  }

  /*
   * Formata CPF para exibição na tabela.
   */
  formatarCpfTabela(cpf: string): string {
    const digitos = cpf.replace(/\D/g, '').slice(0, 11);

    if (digitos.length !== 11) {
      return cpf;
    }

    return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
