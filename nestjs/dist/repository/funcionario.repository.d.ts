import { JavaApiClientService } from '../service/java-api-client.service';
export declare class FuncionarioRepository {
    private readonly javaApi;
    constructor(javaApi: JavaApiClientService);
    findAll(): Promise<unknown>;
    findById(id: number): Promise<unknown>;
    create(funcionario: unknown): Promise<unknown>;
    update(id: number, funcionario: unknown): Promise<unknown>;
    patch(id: number, funcionario: unknown): Promise<unknown>;
    delete(id: number): Promise<boolean>;
}
