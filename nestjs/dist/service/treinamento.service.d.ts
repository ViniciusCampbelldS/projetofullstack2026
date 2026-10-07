import { TreinamentoRepository } from '../repository/treinamento.repository';
export declare class TreinamentoService {
    private readonly repository;
    constructor(repository: TreinamentoRepository);
    getDados(): Promise<unknown>;
    getTreinamentoById(id: number): Promise<unknown>;
    create(treinamento: unknown): Promise<unknown>;
    delete(id: number): Promise<boolean>;
    update(id: number, treinamento: unknown): Promise<unknown>;
    patch(id: number, treinamento: unknown): Promise<unknown>;
}
