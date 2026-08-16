import { FuncionarioRepository } from '../repository/funcionario.repository';
type Funcionario = {
    cpf: string;
    nome: string;
    setor: string;
    cargo: string;
    permicoes: string;
    NRs: string[];
    status?: string;
};
export declare class FuncionarioService {
    private repository;
    constructor(repository: FuncionarioRepository);
    getDados(): any;
    getFuncionarioByCpf(cpf: string): any;
    create(funcionario: Funcionario): {
        status: string;
        cpf: string;
        nome: string;
        setor: string;
        cargo: string;
        permicoes: string;
        NRs: string[];
    };
    delete(cpf: string): {
        deleted: boolean;
    };
    update(cpf: string, funcionario: Funcionario): any;
    patch(cpf: string, funcionario: Partial<Funcionario>): any;
    private validarFuncionario;
    private validarPatch;
}
export {};
