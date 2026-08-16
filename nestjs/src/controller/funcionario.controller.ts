import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { FuncionarioService } from '../service/funcionario.service';

type FuncionarioBody = {
  cpf: string;
  nome: string;
  setor: string;
  cargo: string;
  permicoes: string;
  NRs: string[];
  status?: string;
};

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Get()
  getDados() {
    return this.funcionarioService.getDados();
  }

  @Get(':cpf')
  getFuncionario(@Param('cpf') cpf: string) {
    return this.funcionarioService.getFuncionarioByCpf(cpf);
  }

  @Post()
  create(@Body() body: FuncionarioBody) {
    return this.funcionarioService.create(body);
  }

  @Delete(':cpf')
  delete(@Param('cpf') cpf: string) {
    return this.funcionarioService.delete(cpf);
  }

  @Put(':cpf')
  update(@Param('cpf') cpf: string, @Body() body: FuncionarioBody) {
    return this.funcionarioService.update(cpf, body);
  }

  @Patch(':cpf')
  patch(@Param('cpf') cpf: string, @Body() body: Partial<FuncionarioBody>) {
    return this.funcionarioService.patch(cpf, body);
  }
}
