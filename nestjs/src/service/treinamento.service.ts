import { Injectable } from '@nestjs/common';
import { TreinamentoRepository } from '../repository/treinamento.repository';

//valida, aplica regra de negócio, Decide o que chamar no Repository, Lança erros quando algo está errado

@Injectable()
export class TreinamentoService {

  constructor(private repository: TreinamentoRepository) {}

  getDados() { return this.repository.findAll(); }

  getTreinamentoById(id: number) { return this.repository.findById(id); }
  
  create(treinamento:any){ return this.repository.create(treinamento); }

  delete(id: number) { return this.repository.delete(id); }

  update(id: number, treinamento: any) { return this.repository.update(id, treinamento); }
  
  patch(id: number, treinamento: any) { return this.repository.patch(id, treinamento); }

}