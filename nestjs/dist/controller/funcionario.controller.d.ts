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
    getFuncionario(id: number): any;
    create(body: FuncionarioBody): {
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
    update(id: number, body: FuncionarioBody): any;
    patch(id: number, body: Partial<FuncionarioBody>): any;
}
export {};
