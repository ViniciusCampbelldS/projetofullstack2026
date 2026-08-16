export declare class EpiRepository {
    private readonly dbPath;
    findAll(): any;
    findById(id: number): any;
    create(epi: any): any;
    delete(id: number): boolean;
    update(id: number, epi: any): boolean;
    patch(id: number, epi: any): boolean;
}
