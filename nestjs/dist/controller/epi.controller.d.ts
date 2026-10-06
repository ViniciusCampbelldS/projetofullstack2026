import { EpiService } from '../service/epi.service';
export declare class EpiController {
    private readonly epiService;
    constructor(epiService: EpiService);
    getDados(): any;
    getEpi(id: string): any;
    create(body: {
        nome: string;
        ca: string;
        lote: string;
        validade: string;
        quantidade: number;
    }): {
        quantidade: number;
        epis: any[];
    };
    delete(id: string): boolean;
    update(id: string, body: {
        nome: string;
        ca: string;
        lote: string;
        validade: string;
        substituido: boolean;
    }): any;
    patch(id: string, body: any): any;
}
