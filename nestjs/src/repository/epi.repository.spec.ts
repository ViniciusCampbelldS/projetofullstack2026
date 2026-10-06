import { EpiRepository } from './epi.repository';
import { describe, it, expect, jest } from '@jest/globals';
import * as fs from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('EpiRepository', () => {
  it('loads the JSON database from the project db directory', () => {
    jest.mocked(fs.readFileSync).mockReturnValue('[]' as never);
    const repository = new EpiRepository();
    const epis = repository.findAll();

    expect(Array.isArray(epis)).toBe(true);
  });

  it('creates separate records without persisting batch quantity', () => {
    const writeMock = jest.mocked(fs.writeFileSync);
    jest.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([{ id: 4, nome: 'Existente' }]) as never);
    const repository = new EpiRepository();

    const created = repository.createMany({ nome: 'Capacete', ca: '12345', lote: 'L1', validade: '2027-01-01', substituido: false }, 2);
    const persisted = JSON.parse(writeMock.mock.calls[0][1] as string);

    expect(created.map((epi) => epi.id)).toEqual([5, 6]);
    expect(persisted.slice(-2).every((epi: Record<string, unknown>) => !('quantidade' in epi))).toBe(true);

  });
});
