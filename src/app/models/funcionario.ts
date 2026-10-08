// Representa um funcionário como ele será utilizado pela interface Angular / recebido da API.
export interface Funcionario {

  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  setor: string;
  // Permissão utilizada pela API.
  // ADM = administrador
  // field = funcionário
  // tst = técnico de segurança
  permissoes: string;
  nRs: string[];
  // Situação armazenada pela API.
  // At = Ativo
  // Af = Afastado
  // In = Inativo
  status: string;
}

/*
 * Status  do funcionário na empresa.
 * A API Java utiliza:
 * At = Ativo
 * Af = Afastado
 * In = Inativo
 */
export type FuncionarioStatus =
  | 'Ativo'
  | 'Inativo'
  | 'Afastado';

  // Representa o filtro de status.
// "Todos" significa que nenhuma restrição de situação será aplicada.
export type FuncionarioStatusFiltro =
  | FuncionarioStatus
  | 'Todos'
  | 'Ativos e Afastados';

// Payload enviado pelo Angular para POST e PUT ( para cadastro / alteração.)
export interface FuncionarioRequest {
  nome: string;
  cargo: string;
  cpf: string;
  setor: string;
  // Permissão e Status no formato esperado pelo Java.
  permissoes: string;
  status: string;
  nRs: string[];
}