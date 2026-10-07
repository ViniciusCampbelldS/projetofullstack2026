import { EpiService } from '../service/epi.service';
export declare class EpiController {
    private readonly epiService;
    constructor(epiService: EpiService);
    getDados(): Promise<unknown>;
    getEpi(id: string): Promise<unknown>;
    create(body: {
        nome: string;
        ca: string;
        lote: string;
        validade: string;
        quantidade: number;
    }): {
        quantidade: number;
        epis: Promise<{
            quantidade: number;
            epis: unknown[];
        }>;
    };
    delete(id: string): Promise<boolean>;
    update(id: string, body: {
        nome: string;
        ca: string;
        lote: string;
        validade: string;
        substituido: boolean;
    }): Promise<unknown>;
    patch(id: string, body: any): Promise<unknown>;
}
