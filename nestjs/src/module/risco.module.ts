import { Module } from '@nestjs/common';
import { RiscoController } from '../controller/risco.controller';
import { RiscoService } from '../service/risco.service';
import { RiscoRepository } from '../repository/risco.repository';

@Module({
	controllers: [RiscoController],
	providers: [RiscoService, RiscoRepository],
	exports: [RiscoService, RiscoRepository], // Exporta o serviço e o repositório para que possam ser usados em outros módulos
})

export class RiscoModule { }
