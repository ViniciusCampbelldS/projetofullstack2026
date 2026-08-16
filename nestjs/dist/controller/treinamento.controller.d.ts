import { TreinamentoService } from '../service/treinamento.service';
export declare class TreinamentoController {
    private readonly TreinamentoService;
    constructor(TreinamentoService: TreinamentoService);
    getDados(): any;
    getTreinamento(id: string): any;
    create(body: {
        nome: string;
        tipo: string;
    }): any;
    delete(id: string): boolean;
    update(id: string, body: any): boolean;
    patch(id: string, body: any): boolean;
}
