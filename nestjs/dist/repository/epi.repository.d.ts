import { JavaApiClientService } from '../service/java-api-client.service';
export declare class EpiRepository {
    private readonly javaApi;
    constructor(javaApi: JavaApiClientService);
    findAll(): Promise<unknown>;
    findById(id: number): Promise<unknown>;
    create(epi: unknown): Promise<unknown>;
    createMany(epi: unknown, quantidade: number): Promise<{
        quantidade: number;
        epis: unknown[];
    }>;
    delete(id: number): Promise<boolean>;
    update(id: number, epi: unknown): Promise<unknown>;
    patch(id: number, epi: unknown): Promise<unknown>;
    private mapEpi;
}
