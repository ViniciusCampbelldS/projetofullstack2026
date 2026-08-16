import { RiscoRepository } from '../repository/risco.repository';
export declare class RiscoService {
    private repository;
    constructor(repository: RiscoRepository);
    getDados(): any;
    getRiscoById(id: number): any;
    create(risco: any): any;
    delete(id: number): boolean;
    update(id: number, risco: any): boolean;
    patch(id: number, risco: any): boolean;
}
