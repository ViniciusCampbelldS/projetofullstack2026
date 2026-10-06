export interface RegraAviso {
    id: number;
    caOuNr: string;
    diasAviso: number;
    isNorma: boolean;
}
export declare class RegraAvisoRepository {
    private readonly dbPath;
    findAll(): RegraAviso[];
    create(regra: Omit<RegraAviso, 'id'>): RegraAviso;
    update(id: number, regra: Omit<RegraAviso, 'id'>): RegraAviso | undefined;
    delete(id: number): boolean;
}
