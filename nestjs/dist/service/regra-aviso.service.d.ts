import { RegraAviso, RegraAvisoRepository } from '../repository/regra-aviso.repository';
export declare class RegraAvisoService {
    private readonly repository;
    constructor(repository: RegraAvisoRepository);
    findAll(): RegraAviso[];
    create(regra: Omit<RegraAviso, 'id'>): RegraAviso;
    update(id: number, regra: Omit<RegraAviso, 'id'>): RegraAviso;
    delete(id: number): void;
}
