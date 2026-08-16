import { Injectable } from '@nestjs/common';
import { RiscoRepository } from '../repository/risco.repository';

//valida, aplica regra de negócio, Decide o que chamar no Repository, Lança erros quando algo está errado

@Injectable()
export class RiscoService {

  // Modo manual: private repository = new RiscoRepository();
  // Modo com factory:
  constructor(private repository: RiscoRepository) {}

  getDados() { return this.repository.findAll(); }

  getRiscoById(id: number) { return this.repository.findById(id); }
  
  create(risco:any){ return this.repository.create(risco); }

  delete(id: number) { return this.repository.delete(id); }

  update(id: number, risco: any) { return this.repository.update(id, risco); }
  
  patch(id: number, risco: any) { return this.repository.patch(id, risco); }

}