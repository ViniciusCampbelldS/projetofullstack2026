import { Injectable } from '@nestjs/common';
import { JavaApiClientService } from '../service/java-api-client.service';

export interface RegraAviso {
  id: number;
  caOuNr: string;
  diasAviso: number;
  isNorma: boolean;
}

@Injectable()
export class RegraAvisoRepository {
  constructor(private readonly javaApi: JavaApiClientService) {}

  async findAll(): Promise<RegraAviso[]> {
    return this.javaApi.request({ method: 'GET', path: '/dias-notificacao' });
  }

  async create(regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso> {
    return this.javaApi.request({
      method: 'POST',
      path: '/dias-notificacao',
      body: regra,
    });
  }

  async update(id: number, regra: Omit<RegraAviso, 'id'>): Promise<RegraAviso> {
    return this.javaApi.request({
      method: 'PUT',
      path: `/dias-notificacao/${id}`,
      body: regra,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.javaApi.request({
      method: 'DELETE',
      path: `/dias-notificacao/${id}`,
    });
    return true;
  }
}