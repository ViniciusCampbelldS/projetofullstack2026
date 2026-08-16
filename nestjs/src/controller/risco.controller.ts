import { Controller, Get, Param, Post, Body, Delete, Put, Patch } from '@nestjs/common';
import { RiscoService } from '../service/risco.service';


@Controller('riscos') // rota padrão
export class RiscoController {
  constructor(private readonly riscoService: RiscoService) { }

  @Get()
  getDados() {
    return this.riscoService.getDados()
  }

  @Get(':id')
  getRisco(@Param('id') id: string) {
    return this.riscoService.getRiscoById(Number(id));
  }

  @Post() // responde ao POST /riscos
  create(@Body() body: { nome: string; tipo: string }) {
    return this.riscoService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.riscoService.delete(Number(id)); }
  //Mudamos o método  (DELETE). A rota riscos é padrão, e o id 3 indica o registro apagado

  @Put(':id') // → PUT (id) localhost:3000/riscos/
  update(@Param('id') id: string, @Body() body: any) { return this.riscoService.update(Number(id), body); }

  @Patch(':id') // → PATCH (id) localhost:3000/riscos/
  patch(@Param('id') id: string, @Body() body: any) { return this.riscoService.patch(Number(id), body); }
}