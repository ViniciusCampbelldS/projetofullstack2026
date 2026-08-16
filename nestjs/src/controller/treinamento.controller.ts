import { Controller, Get, Param, Post, Body, Delete, Put, Patch } from '@nestjs/common';
import { TreinamentoService } from '../service/treinamento.service';

@Controller('treinamentos')
export class TreinamentoController {
    constructor(private readonly TreinamentoService: TreinamentoService) { }

    @Get()
    getDados() {
      return this.TreinamentoService.getDados()
    }
  
    @Get(':id')
    getTreinamento(@Param('id') id: string) {
      return this.TreinamentoService.getTreinamentoById(Number(id));
    }
  
    @Post() // responde ao POST /epis
    create(@Body() body: { nome: string; tipo: string }) {
      return this.TreinamentoService.create(body);
    }
  
    @Delete(':id')
    delete(@Param('id') id: string) { return this.TreinamentoService.delete(Number(id)); }
    //Mudamos o método  (DELETE). A rota epis é padrão, e o id 3 indica o registro apagado
  
    @Put(':id') // → PUT (id) localhost:3000/epis/
    update(@Param('id') id: string, @Body() body: any) { return this.TreinamentoService.update(Number(id), body); }
  
    @Patch(':id') // → PATCH (id) localhost:3000/epis/
    patch(@Param('id') id: string, @Body() body: any) { return this.TreinamentoService.patch(Number(id), body); }
}
