export declare class EpiRepository {
    private readonly dbPath;
    findAll(): any;
    findById(id: number): any;
    create(epi: any): any;
    createMany(epi: any, quantidade: number): any[];
    delete(id: number): boolean;
    update(id: number, epi: any): any;
    patch(id: number, epi: any): any;
}
