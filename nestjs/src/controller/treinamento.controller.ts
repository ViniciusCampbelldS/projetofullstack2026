import { Controller, Get, Param, Post, Body, Delete, Put, Patch } from '@nestjs/common';
import { TreinamentoService } from '../service/treinamento.service';

@Controller('treinamentos')
export class TreinamentoController {
    constructor(private readonly TreinamentoService: TreinamentoService) { }

	// List all - GET http://localhost:3000/treinamentos
    @Get()
    getDados() {
      return this.TreinamentoService.getDados()
    }
  
	// Find by id - GET http://localhost:3000/treinamentos/1
    @Get(':id')
    getTreinamento(@Param('id') id: string) {
      return this.TreinamentoService.getTreinamentoById(Number(id));
    }
  
	// New entry - POST http://localhost:3000/treinamentos
    @Post()
    create(@Body() body: { nome: string; tipo: string }) {
      return this.TreinamentoService.create(body);
    }
  
    // Delete by id - DELETE http://localhost:3000/treinamentos/1
    @Delete(':id')
    delete(@Param('id') id: string) { return this.TreinamentoService.delete(Number(id)); }
  
	// Update by id - PUT http://localhost:3000/treinamentos/1
    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) { return this.TreinamentoService.update(Number(id), body); }
  
	// Update specific fields by id - PATCH http://localhost:3000/treinamentos/1
    @Patch(':id')
    patch(@Param('id') id: string, @Body() body: any) { return this.TreinamentoService.patch(Number(id), body); }
}
