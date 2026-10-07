import { Injectable } from '@nestjs/common';
import { EpiRepository } from '../repository/epi.repository';

//valida, aplica regra de negócio, Decide o que chamar no Repository, Lança erros quando algo está errado

@Injectable()
export class EpiService {

  constructor(private repository: EpiRepository) {}

  async getDados() { return this.repository.findAll(); }

  async getEpiById(id: number) { return this.repository.findById(id); }
  
  async createMany(epi: any, quantidade: number) { return this.repository.createMany(epi, quantidade); }

  async delete(id: number) { return this.repository.delete(id); }

  async update(id: number, epi: any) { return this.repository.update(id, epi); }
  
  async patch(id: number, epi: any) { return this.repository.patch(id, epi); }

}