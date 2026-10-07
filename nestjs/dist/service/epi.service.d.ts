import { EpiRepository } from '../repository/epi.repository';
export declare class EpiService {
    private repository;
    constructor(repository: EpiRepository);
    getDados(): Promise<unknown>;
    getEpiById(id: number): Promise<unknown>;
    createMany(epi: any, quantidade: number): Promise<{
        quantidade: number;
        epis: unknown[];
    }>;
    delete(id: number): Promise<boolean>;
    update(id: number, epi: any): Promise<unknown>;
    patch(id: number, epi: any): Promise<unknown>;
}
