import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { EpiController } from './epi.controller';

describe('EpiController', () => {
	const body = { nome: 'Capacete', ca: '12345', lote: 'L1', validade: '2027-01-01', quantidade: 2 };

	it('creates an EPI as not replaced', () => {
		const epiService = { createMany: jest.fn().mockReturnValue([{ id: 1, nome: body.nome }]) };
		const controller = new EpiController(epiService as never);

		const response = controller.create(body);

		expect(epiService.createMany).toHaveBeenCalledWith(
			{ nome: body.nome, ca: body.ca, lote: body.lote, validade: body.validade, substituido: false },
			body.quantidade,
		);
		expect(response).toEqual({ quantidade: 2, epis: [{ id: 1, nome: body.nome }] });
	});

	it('requires validity when creating and updating', () => {
		const epiService = { createMany: jest.fn(), update: jest.fn() };
		const controller = new EpiController(epiService as never);
		const update = { nome: body.nome, ca: body.ca, lote: body.lote, validade: body.validade, substituido: true };

		expect(() => controller.create({ ...body, validade: '' })).toThrow(BadRequestException);
		expect(() => controller.create({ ...body, quantidade: 0 })).toThrow(BadRequestException);
		expect(() => controller.create({ ...body, quantidade: 1.5 })).toThrow(BadRequestException);
		expect(() => controller.update('1', { ...update, validade: '' })).toThrow(BadRequestException);
	});

	it('allows replacement to change during update', () => {
		const epiService = { update: jest.fn() };
		const controller = new EpiController(epiService as never);
		const update = { nome: body.nome, ca: body.ca, lote: body.lote, validade: body.validade, substituido: true };

		controller.update('1', update);

		expect(epiService.update).toHaveBeenCalledWith(1, update);
	});
});