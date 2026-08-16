import { TreinamentoRepository } from '../repository/treinamento.repository';
export declare class TreinamentoService {
    private repository;
    constructor(repository: TreinamentoRepository);
    getDados(): any;
    getTreinamentoById(id: number): any;
    create(treinamento: any): any;
    delete(id: number): boolean;
    update(id: number, treinamento: any): boolean;
    patch(id: number, treinamento: any): boolean;
}
