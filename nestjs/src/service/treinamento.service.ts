import { Injectable } from '@nestjs/common';
import { TreinamentoRepository } from '../repository/treinamento.repository';

@Injectable()
export class TreinamentoService {
  constructor(private readonly repository: TreinamentoRepository) {}

  async getDados() { return this.repository.findAll(); }
  async getTreinamentoById(id: number) { return this.repository.findById(id); }
  async create(treinamento: unknown) { return this.repository.create(treinamento); }
  async delete(id: number) { return this.repository.delete(id); }
  async update(id: number, treinamento: unknown) { return this.repository.update(id, treinamento); }
  async patch(id: number, treinamento: unknown) { return this.repository.patch(id, treinamento); }
}