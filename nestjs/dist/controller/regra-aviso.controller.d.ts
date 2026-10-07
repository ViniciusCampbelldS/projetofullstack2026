import type { RegraAviso } from '../repository/regra-aviso.repository';
import { RegraAvisoService } from '../service/regra-aviso.service';
export declare class RegraAvisoController {
    private readonly service;
    constructor(service: RegraAvisoService);
    findAll(): Promise<RegraAviso[]>;
    create(body: unknown): Promise<RegraAviso>;
    update(id: string, body: unknown): Promise<RegraAviso>;
    delete(id: string): Promise<void>;
    private validarBody;
}
