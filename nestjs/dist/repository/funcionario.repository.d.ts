type Funcionario = {
    id: number;
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
    findById(id: number): any;
    create(funcionario: Omit<Funcionario, 'id'>): {
        status: string;
        nome: string;
        cpf: string;
        setor: string;
        cargo: string;
        permicoes: string;
        NRs: string[];
        id: any;
    };
    delete(id: number): boolean;
    update(id: number, funcionario: Omit<Funcionario, 'id'>): boolean;
    patch(id: number, funcionario: Partial<Omit<Funcionario, 'id'>>): boolean;
}
export {};
