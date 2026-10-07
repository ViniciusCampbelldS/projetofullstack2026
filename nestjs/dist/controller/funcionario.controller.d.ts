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
    getDados(): Promise<unknown>;
    getFuncionario(id: number): Promise<unknown>;
    create(body: FuncionarioBody): Promise<unknown>;
    delete(id: number): Promise<{
        deleted: boolean;
    }>;
    update(id: number, body: FuncionarioBody): Promise<unknown>;
    patch(id: number, body: Partial<FuncionarioBody>): Promise<unknown>;
}
export {};
