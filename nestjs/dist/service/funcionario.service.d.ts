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
    getFuncionarioById(id: number): any;
    create(funcionario: Funcionario): {
        status: string;
        nome: string;
        cpf: string;
        setor: string;
        cargo: string;
        permicoes: string;
        NRs: string[];
        id: any;
    };
    delete(id: number): {
        deleted: boolean;
    };
    update(id: number, funcionario: Funcionario): any;
    patch(id: number, funcionario: Partial<Funcionario>): any;
    private validarFuncionario;
    private validarPatch;
}
export {};
