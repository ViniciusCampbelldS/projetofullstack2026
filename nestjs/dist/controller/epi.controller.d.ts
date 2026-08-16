import { EpiService } from '../service/epi.service';
export declare class EpiController {
    private readonly epiService;
    constructor(epiService: EpiService);
    getDados(): any;
    getEpi(id: string): any;
    create(body: {
        nome: string;
        ca: string;
        funcionario: string;
        vencimento: string;
    }): any;
    delete(id: string): boolean;
    update(id: string, body: any): boolean;
    patch(id: string, body: any): boolean;
}
