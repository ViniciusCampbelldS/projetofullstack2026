import { FuncionarioService } from '../service/funcionario.service';
type FuncionarioBody = {
    cpf: string;
    nome: string;
    setor: string;
    cargo: string;
    permicoes: string;
    NRs: string[];
    status?: string;
};
export declare class FuncionarioController {
    private readonly funcionarioService;
    constructor(funcionarioService: FuncionarioService);
    getDados(): any;
    getFuncionario(cpf: string): any;
    create(body: FuncionarioBody): {
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
    update(cpf: string, body: FuncionarioBody): any;
    patch(cpf: string, body: Partial<FuncionarioBody>): any;
}
export {};
