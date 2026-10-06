export declare class TreinamentoRepository {
    private readonly dbPath;
    findAll(): any;
    findById(id: number): any;
    create(treinamento: any): any;
    delete(id: number): boolean;
    update(id: number, treinamento: any): boolean;
    patch(id: number, treinamento: any): boolean;
}
