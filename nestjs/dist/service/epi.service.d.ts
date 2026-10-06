import { EpiRepository } from '../repository/epi.repository';
export declare class EpiService {
    private repository;
    constructor(repository: EpiRepository);
    getDados(): any;
    getEpiById(id: number): any;
    createMany(epi: any, quantidade: number): any[];
    delete(id: number): boolean;
    update(id: number, epi: any): any;
    patch(id: number, epi: any): any;
}
