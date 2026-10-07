import { EpiRepository } from './epi.repository';
import { JavaApiClientService } from '../service/java-api-client.service';
import { describe, expect, it, jest } from '@jest/globals';

describe('EpiRepository', () => {
  it('mapeia o contrato Angular para o payload do Java', async () => {
    const javaApi = {
      request: jest.fn<() => Promise<unknown>>().mockResolvedValue({ id: 1 }),
    } as unknown as JavaApiClientService;
    const repository = new EpiRepository(javaApi);

    await repository.create({
      nome: 'Capacete',
      ca: '12345',
      lote: 'L1',
      validade: '2027-01-01',
      funcionarioIds: [3],
      substituido: false,
    });

    expect(javaApi.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/epis',
      body: {
        nome: 'Capacete',
        ca: '12345',
        lote: 'L1',
        vencimento: '2027-01-01',
        funcionarioIds: [3],
        substituido: false,
      },
    });
  });

  it('usa PUT para atualização parcial sem PATCH no Java', async () => {
    const javaApi = {
      request: jest.fn<() => Promise<unknown>>().mockResolvedValue({ id: 1 }),
    } as unknown as JavaApiClientService;
    const repository = new EpiRepository(javaApi);

    await repository.patch(1, { substituido: true });

    expect(javaApi.request).toHaveBeenCalledWith({
      method: 'PUT',
      path: '/epis/1',
      body: {
        nome: undefined,
        ca: undefined,
        lote: undefined,
        vencimento: undefined,
        funcionarioIds: [],
        substituido: true,
      },
    });
  });
});
