import { JavaApiClientService } from '../service/java-api-client.service';
export interface RegraAviso {
    id: number;
    caOuNr: string;
    diasAviso: number;
    isNorma: boolean;
}
export declare class RegraAvisoRepository {
    private readonly javaApi;
    constructor(javaApi: JavaApiClientService);
    findAll(): Promise<RegraAviso[]>;
    create(regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso>;
    update(id: number, regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso>;
    delete(id: number): Promise<boolean>;
}
