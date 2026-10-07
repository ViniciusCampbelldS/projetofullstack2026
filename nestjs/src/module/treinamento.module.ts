import { Module } from '@nestjs/common';
import { TreinamentoController } from '../controller/treinamento.controller';
import { TreinamentoService } from '../service/treinamento.service';
import { TreinamentoRepository } from '../repository/treinamento.repository';
import { JavaApiClientService } from '../service/java-api-client.service';

@Module({
  controllers: [TreinamentoController],
  providers: [TreinamentoService, TreinamentoRepository, JavaApiClientService],
  exports: [TreinamentoService, TreinamentoRepository, JavaApiClientService],
})
export class TreinamentoModule {}