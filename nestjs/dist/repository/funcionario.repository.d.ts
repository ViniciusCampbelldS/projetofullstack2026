type Funcionario = {
    cpf: string;
    nome: string;
    setor: string;
    cargo: string;
    permicoes: string;
    NRs: string[];
    status?: string;
};
export declare class FuncionarioRepository {
    private readonly dbPath;
    findAll(): any;
    findByCpf(cpf: string): any;
    create(funcionario: Funcionario): {
        status: string;
        cpf: string;
        nome: string;
        setor: string;
        cargo: string;
        permicoes: string;
        NRs: string[];
    };
    delete(cpf: string): boolean;
    update(cpf: string, funcionario: Funcionario): boolean;
    patch(cpf: string, funcionario: Partial<Funcionario>): boolean;
}
export {};
