import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
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
	constructor(private readonly funcionarioService: FuncionarioService) { }

	// List all - GET http://localhost:3000/funcionarios
	@Get()
	getDados() {
		return this.funcionarioService.getDados();
	}

	// Find by ID - GET http://localhost:3000/funcionarios/1
	@Get(':id')
	getFuncionario(@Param('id', ParseIntPipe) id: number) {
		return this.funcionarioService.getFuncionarioById(id);
	}

	// New entry - POST http://localhost:3000/funcionarios
	@Post()
	create(@Body() body: FuncionarioBody) {
		return this.funcionarioService.create(body);
	}

	// Delete by ID - DELETE http://localhost:3000/funcionarios/1
	@Delete(':id')
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.funcionarioService.delete(id);
	}

	// Update by ID - PUT http://localhost:3000/funcionarios/1
	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() body: FuncionarioBody) {
		return this.funcionarioService.update(id, body);
	}

	// Update specific fields by ID - PATCH http://localhost:3000/funcionarios/1
	@Patch(':id')
	patch(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<FuncionarioBody>) {
		return this.funcionarioService.patch(id, body);
	}
}
