import type { RegraAviso } from '../repository/regra-aviso.repository';
import { RegraAvisoService } from '../service/regra-aviso.service';
export declare class RegraAvisoController {
    private readonly service;
    constructor(service: RegraAvisoService);
    findAll(): RegraAviso[];
    create(body: unknown): RegraAviso;
    update(id: string, body: unknown): RegraAviso;
    delete(id: string): void;
    private validarBody;
}
