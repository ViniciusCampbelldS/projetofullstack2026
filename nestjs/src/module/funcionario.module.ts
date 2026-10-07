import { Module } from '@nestjs/common';
import { FuncionarioController } from '../controller/funcionario.controller';
import { FuncionarioService } from '../service/funcionario.service';
import { FuncionarioRepository } from '../repository/funcionario.repository';
import { JavaApiClientService } from '../service/java-api-client.service';

@Module({
  controllers: [FuncionarioController],
  providers: [FuncionarioService, FuncionarioRepository, JavaApiClientService],
  exports: [FuncionarioService, FuncionarioRepository, JavaApiClientService],
})
export class FuncionarioModule {}
