import { Module } from '@nestjs/common';
import { EpiController } from '../controller/epi.controller';
import { EpiService } from '../service/epi.service';
import { EpiRepository } from '../repository/epi.repository';

@Module({
	controllers: [EpiController],
	providers: [EpiService, EpiRepository],
	exports: [EpiService, EpiRepository], // Exporta o serviço e o repositório para que possam ser usados em outros módulos
})

export class EpiModule { }
