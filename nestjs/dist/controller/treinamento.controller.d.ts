import { TreinamentoService } from '../service/treinamento.service';
export declare class TreinamentoController {
    private readonly TreinamentoService;
    constructor(TreinamentoService: TreinamentoService);
    getDados(): Promise<unknown>;
    getTreinamento(id: string): Promise<unknown>;
    create(body: {
        nome: string;
        tipo: string;
    }): Promise<unknown>;
    delete(id: string): Promise<boolean>;
    update(id: string, body: any): Promise<unknown>;
    patch(id: string, body: any): Promise<unknown>;
}
