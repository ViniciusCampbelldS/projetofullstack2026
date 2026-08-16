import { EpiRepository } from './epi.repository';
import { describe, it, expect } from '@jest/globals';

describe('EpiRepository', () => {
  it('loads the JSON database from the project db directory', () => {
    const repository = new EpiRepository();
    const epis = repository.findAll();

    expect(Array.isArray(epis)).toBe(true);
  });
});
