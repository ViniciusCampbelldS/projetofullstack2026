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
    getDados(): Promise<unknown>;
    getFuncionarioById(id: number): Promise<unknown>;
    create(funcionario: Funcionario): Promise<unknown>;
    delete(id: number): Promise<{
        deleted: boolean;
    }>;
    update(id: number, funcionario: Funcionario): Promise<unknown>;
    patch(id: number, funcionario: Partial<Funcionario>): Promise<unknown>;
    private validarFuncionario;
    private validarPatch;
}
export {};
