import { Injectable } from '@nestjs/common';
import { JavaApiClientService } from '../service/java-api-client.service';

@Injectable()
export class EpiRepository {
  constructor(private readonly javaApi: JavaApiClientService) {}

  async findAll() {
    return this.javaApi.request({ method: 'GET', path: '/epis' });
  }

  async findById(id: number) {
    return this.javaApi.request({ method: 'GET', path: `/epis/${id}` });
  }

  async create(epi: unknown) {
    return this.javaApi.request({ method: 'POST', path: '/epis', body: this.mapEpi(epi) });
  }

  async createMany(epi: unknown, quantidade: number) {
    const mapped = this.mapEpi(epi);
    const epis = await Promise.all(
      Array.from({ length: quantidade }, () =>
        this.javaApi.request({ method: 'POST', path: '/epis', body: mapped }),
      ),
    );
    return { quantidade, epis };
  }

  async delete(id: number) {
    await this.javaApi.request({ method: 'DELETE', path: `/epis/${id}` });
    return true;
  }

  async update(id: number, epi: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/epis/${id}`,
      body: this.mapEpi(epi),
    });
  }

  async patch(id: number, epi: unknown) {
    return this.javaApi.request({
      method: 'PUT',
      path: `/epis/${id}`,
      body: this.mapEpi(epi),
    });
  }

  private mapEpi(epi: unknown) {
    const source = epi as Record<string, unknown>;
    return {
      nome: source.nome,
      ca: source.ca,
      lote: source.lote,
      vencimento: source.validade ?? source.vencimento,
      funcionarioIds: source.funcionarioIds ?? [],
      substituido: source.substituido ?? false,
    };
  }
}