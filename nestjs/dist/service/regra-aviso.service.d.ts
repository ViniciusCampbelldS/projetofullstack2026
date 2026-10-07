import { RegraAviso, RegraAvisoRepository } from '../repository/regra-aviso.repository';
export declare class RegraAvisoService {
    private readonly repository;
    constructor(repository: RegraAvisoRepository);
    findAll(): Promise<RegraAviso[]>;
    create(regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso>;
    update(id: number, regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso>;
    delete(id: number): Promise<void>;
}
