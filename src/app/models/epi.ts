export interface Epi{
    id: number;
    nome: string;
    descricao: string;
    validade: number;
    quantidade: number;
    funcionarios: Funcionario;
}

export interface EpiRequest{
    nome: string;
    descricao: string;
    validade: number;
    quantidade: number;
    funcionarios: Funcionario;
}