export interface Funcionario {
    id: number;
    nome: string;
    cpf: string;
    cargo: string;
    setor: string;
    permissoes: string;
    nRs: string[];
    status?: string;
}