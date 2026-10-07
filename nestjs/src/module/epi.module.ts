import { Module } from '@nestjs/common';
import { EpiController } from '../controller/epi.controller';
import { EpiService } from '../service/epi.service';
import { EpiRepository } from '../repository/epi.repository';
import { JavaApiClientService } from '../service/java-api-client.service';

@Module({
	controllers: [EpiController],
	providers: [EpiService, EpiRepository, JavaApiClientService],
	exports: [EpiService, EpiRepository, JavaApiClientService],
})

export class EpiModule { }
