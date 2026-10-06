import { Injectable, NotFoundException } from '@nestjs/common';
import { RegraAviso, RegraAvisoRepository } from '../repository/regra-aviso.repository';

@Injectable()
export class RegraAvisoService {
    constructor(private readonly repository: RegraAvisoRepository) {}

    findAll(): RegraAviso[] {
        return this.repository.findAll();
    }

    create(regra: Omit<RegraAviso, 'id'>): RegraAviso {
        return this.repository.create(regra);
    }

    update(id: number, regra: Omit<RegraAviso, 'id'>): RegraAviso {
        const updated = this.repository.update(id, regra);
        if (!updated) throw new NotFoundException('Regra de aviso não encontrada.');
        return updated;
    }

    delete(id: number): void {
        if (!this.repository.delete(id)) throw new NotFoundException('Regra de aviso não encontrada.');
    }
}