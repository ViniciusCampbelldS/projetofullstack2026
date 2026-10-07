import { JavaApiClientService } from '../service/java-api-client.service';
export declare class TreinamentoRepository {
    private readonly javaApi;
    constructor(javaApi: JavaApiClientService);
    findAll(): Promise<unknown>;
    findById(id: number): Promise<unknown>;
    create(treinamento: unknown): Promise<unknown>;
    delete(id: number): Promise<boolean>;
    update(id: number, treinamento: unknown): Promise<unknown>;
    patch(id: number, treinamento: unknown): Promise<unknown>;
}
