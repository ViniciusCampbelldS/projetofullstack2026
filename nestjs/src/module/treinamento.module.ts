import { Module } from '@nestjs/common';
import { TreinamentoController } from '../controller/treinamento.controller';
import { TreinamentoService } from '../service/treinamento.service';
import { TreinamentoRepository } from '../repository/treinamento.repository';

@Module({
	controllers: [TreinamentoController],
	providers: [TreinamentoService, TreinamentoRepository],
	exports: [TreinamentoService, TreinamentoRepository], // Exporta o serviço e o repositório para que possam ser usados em outros módulos
})

export class TreinamentoModule { }