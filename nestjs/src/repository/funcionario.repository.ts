import { Injectable } from '@nestjs/common';
import { JavaApiClientService } from '../service/java-api-client.service';

@Injectable()
export class FuncionarioRepository {
  constructor(private readonly javaApi: JavaApiClientService) {}

  async findAll() {
    return this.javaApi.request({ method: 'GET', path: '/funcionarios' });
  }

  async findById(id: number) {
    return this.javaApi.request({ method: 'GET', path: `/funcionarios/${id}` });
  }

  async create(funcionario: unknown) {
    return this.javaApi.request({
      method: 'POST',
      path: '/funcionarios',
      body: funcionario,
    });
  }

  async update(id: number, funcionario: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/funcionarios/${id}`,
      body: funcionario,
    });
  }

  async patch(id: number, funcionario: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/funcionarios/${id}`,
      body: funcionario,
    });
  }

  async delete(id: number) {
    await this.javaApi.request({
      method: 'DELETE',
      path: `/funcionarios/${id}`,
    });
    return true;
  }
}
