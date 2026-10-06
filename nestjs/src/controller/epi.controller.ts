import { BadRequestException, Controller, Get, Param, Post, Body, Delete, Put, Patch } from '@nestjs/common';
import { EpiService } from '../service/epi.service';


@Controller('epis') // rota padrão
export class EpiController {
	constructor(private readonly epiService: EpiService) { }

	// List all - GET http://localhost:3000/epis
	@Get()
	getDados() {
		return this.epiService.getDados()
	}

	// Find by id - GET http://localhost:3000/epis/1
	@Get(':id')
	getEpi(@Param('id') id: string) {
		return this.epiService.getEpiById(Number(id));
	}

	// New entry - POST http://localhost:3000/epis
	@Post()
	create(@Body() body: { nome: string; ca: string; lote: string; validade: string; quantidade: number }) {
		if (!body.validade?.trim()) {
			throw new BadRequestException('A validade do EPI é obrigatória.');
		}
		if (!Number.isInteger(body.quantidade) || body.quantidade < 1) {
			throw new BadRequestException('A quantidade do EPI deve ser um número inteiro maior que zero.');
		}

		const { quantidade, ...epi } = body;
		const epis = this.epiService.createMany({ ...epi, substituido: false }, quantidade);
		return { quantidade, epis };
	}

	// Delete by id - DELETE http://localhost:3000/epis/1
	@Delete(':id')
	delete(@Param('id') id: string) { return this.epiService.delete(Number(id)); }

	// Update by id - PUT http://localhost:3000/epis/1
	@Put(':id')
	update(@Param('id') id: string, @Body() body: { nome: string; ca: string; lote: string; validade: string; substituido: boolean }) {
		if (!body.validade?.trim()) {
			throw new BadRequestException('A validade do EPI é obrigatória.');
		}
		return this.epiService.update(Number(id), body);
	}

	// Update specific fields by id - PATCH http://localhost:3000/epis/1
	@Patch(':id')
	patch(@Param('id') id: string, @Body() body: any) {
		if (body.validade !== undefined && !body.validade?.trim()) {
			throw new BadRequestException('A validade do EPI é obrigatória.');
		}

		return this.epiService.patch(Number(id), body);
	}
}

// ,
//   {
//     "id": 3,
//     "ca": "060967",
//     "nome": "Meias 7/8",
//     "funcionario": "Belle Delphine",
//     "vencimento": "1999-10-23T00:00:00.000Z"
//   }