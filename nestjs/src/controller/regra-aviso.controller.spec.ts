import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { RegraAvisoController } from './regra-aviso.controller';

describe('RegraAvisoController', () => {
	it('persists whether a code is an NR', () => {
		const service = { create: jest.fn().mockReturnValue({ id: 1, caOuNr: 'NR-06', diasAviso: 30, isNorma: true }) };
		const controller = new RegraAvisoController(service as never);
		const body = { caOuNr: 'NR-06', diasAviso: 30, isNorma: true };

		controller.create(body);

		expect(service.create).toHaveBeenCalledWith(body);
	});

	it('requires a boolean isNorma', () => {
		const controller = new RegraAvisoController({ create: jest.fn() } as never);

		expect(() => controller.create({ caOuNr: '12345', diasAviso: 30 })).toThrow(BadRequestException);
		expect(() => controller.create({ caOuNr: '12345', diasAviso: 30, isNorma: 'false' })).toThrow(BadRequestException);
	});
});