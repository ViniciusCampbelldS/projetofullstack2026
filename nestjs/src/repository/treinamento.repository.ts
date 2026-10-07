import { Injectable } from '@nestjs/common';
import { JavaApiClientService } from '../service/java-api-client.service';

@Injectable()
export class TreinamentoRepository {
  constructor(private readonly javaApi: JavaApiClientService) {}

  async findAll() {
    return this.javaApi.request({ method: 'GET', path: '/treinamentos' });
  }

  async findById(id: number) {
    return this.javaApi.request({ method: 'GET', path: `/treinamentos/${id}` });
  }

  async create(treinamento: unknown) {
    return this.javaApi.request({ method: 'POST', path: '/treinamentos', body: treinamento });
  }

  async delete(id: number) {
    await this.javaApi.request({ method: 'DELETE', path: `/treinamentos/${id}` });
    return true;
  }

  async update(id: number, treinamento: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/treinamentos/${id}`,
      body: treinamento,
    });
  }

  async patch(id: number, treinamento: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/treinamentos/${id}`,
      body: treinamento,
    });
  }
}