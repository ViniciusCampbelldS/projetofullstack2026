import { RiscoService } from '../service/risco.service';
export declare class RiscoController {
    private readonly riscoService;
    constructor(riscoService: RiscoService);
    getDados(): any;
    getRisco(id: string): any;
    create(body: {
        nome: string;
        tipo: string;
    }): any;
    delete(id: string): boolean;
    update(id: string, body: any): boolean;
    patch(id: string, body: any): boolean;
}
