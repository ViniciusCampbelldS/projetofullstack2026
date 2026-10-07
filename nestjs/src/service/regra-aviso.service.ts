import { Injectable, NotFoundException } from '@nestjs/common';
import { RegraAviso, RegraAvisoRepository } from '../repository/regra-aviso.repository';

@Injectable()
export class RegraAvisoService {
    constructor(private readonly repository: RegraAvisoRepository) {}

    async findAll(): Promise<RegraAviso[]> {
        return this.repository.findAll();
    }

    async create(regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso> {
        return this.repository.create(regra);
    }

    async update(id: number, regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso> {
        return this.repository.update(id, regra);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}