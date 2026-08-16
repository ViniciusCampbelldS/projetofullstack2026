import { EpiRepository } from '../repository/epi.repository';
export declare class EpiService {
    private repository;
    constructor(repository: EpiRepository);
    getDados(): any;
    getEpiById(id: number): any;
    create(epi: any): any;
    delete(id: number): boolean;
    update(id: number, epi: any): boolean;
    patch(id: number, epi: any): boolean;
}
