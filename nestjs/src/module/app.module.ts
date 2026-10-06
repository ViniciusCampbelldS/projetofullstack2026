// src/app.module.ts
import { Module } from '@nestjs/common';
import { EpiModule } from './epi.module';
import { TreinamentoModule } from './treinamento.module';
import { FuncionarioModule } from './funcionario.module';
import { RegraAvisoModule } from './regra-aviso.module';
import { AuthService } from '../service/auth/auth.service';
import { AuthController } from '../controller/auth/auth.controller';


@Module({
  imports: [EpiModule, TreinamentoModule, FuncionarioModule, RegraAvisoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
