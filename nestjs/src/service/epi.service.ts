import { Injectable } from '@nestjs/common';
import { EpiRepository } from '../repository/epi.repository';

//valida, aplica regra de negócio, Decide o que chamar no Repository, Lança erros quando algo está errado

@Injectable()
export class EpiService {

  // Modo manual: private repository = new EpiRepository();
  // Modo com factory:
  constructor(private repository: EpiRepository) {}

  getDados() { return this.repository.findAll(); }

  getEpiById(id: number) { return this.repository.findById(id); }
  
  create(epi:any){ return this.repository.create(epi); }

  delete(id: number) { return this.repository.delete(id); }

  update(id: number, epi: any) { return this.repository.update(id, epi); }
  
  patch(id: number, epi: any) { return this.repository.patch(id, epi); }

}