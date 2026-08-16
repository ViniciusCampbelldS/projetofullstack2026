export declare class RiscoRepository {
    private readonly dbPath;
    findAll(): any;
    findById(id: number): any;
    create(risco: any): any;
    delete(id: number): boolean;
    update(id: number, risco: any): boolean;
    patch(id: number, risco: any): boolean;
}
