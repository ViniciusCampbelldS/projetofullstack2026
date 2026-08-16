import { Module } from '@nestjs/common';
import { FuncionarioController } from '../controller/funcionario.controller';
import { FuncionarioService } from '../service/funcionario.service';
import { FuncionarioRepository } from '../repository/funcionario.repository';

@Module({
  controllers: [FuncionarioController],
  providers: [FuncionarioService, FuncionarioRepository],
  exports: [FuncionarioService, FuncionarioRepository],
})
export class FuncionarioModule {}
