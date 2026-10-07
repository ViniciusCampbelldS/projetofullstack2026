import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import type { RegraAviso } from '../repository/regra-aviso.repository';
import { RegraAvisoService } from '../service/regra-aviso.service';

type RegraAvisoBody = Omit<RegraAviso, 'id'>;

@Controller('avisos')
export class RegraAvisoController {
    constructor(private readonly service: RegraAvisoService) {}

    @Get()
    async findAll(): Promise<RegraAviso[]> {
        return this.service.findAll();
    }

    @Post()
    async create(@Body() body: unknown): Promise<RegraAviso> {
        return this.service.create(this.validarBody(body));
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: unknown): Promise<RegraAviso> {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 1) {
            throw new NotFoundException('Regra de aviso não encontrada.');
        }
        return this.service.update(parsedId, this.validarBody(body));
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 1) {
            throw new NotFoundException('Regra de aviso não encontrada.');
        }
        await this.service.delete(parsedId);
    }

    private validarBody(body: unknown): RegraAvisoBody {
        if (!body || typeof body !== 'object') {
            throw new BadRequestException('Informe CA ou NR e dias de aviso.');
        }

        const candidate = body as Partial<RegraAvisoBody>;
        const caOuNr = typeof candidate.caOuNr === 'string' ? candidate.caOuNr.trim() : '';

        if (!caOuNr || caOuNr.length > 15) {
            throw new BadRequestException('CA ou NR deve conter de 1 a 15 caracteres.');
        }
        if (!Number.isInteger(candidate.diasAviso) || (candidate.diasAviso ?? 0) <= 0) {
            throw new BadRequestException('Dias de aviso deve ser um inteiro maior que zero.');
        }
        if (typeof candidate.isNorma !== 'boolean') {
            throw new BadRequestException('Informe se o código é uma NR.');
        }

        return { caOuNr, diasAviso: candidate.diasAviso!, isNorma: candidate.isNorma };
    }
}