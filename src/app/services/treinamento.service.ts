import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CursoTreinamento { id:number; nrId:number; nome:string; validadeMeses:number; }
export interface TurmaTreinamento { id:number; treinamentoId:number; data:string; horario:string; }
export interface ParticipacaoTreinamento extends TurmaTreinamento { nrId:number; nrNome:string; validadeMeses:number; treinamento:string; funcionarioId:number; funcionario:string; presente:boolean; }

@Injectable({providedIn:'root'})
export class TreinamentoService {
  private readonly http=inject(HttpClient);
  private readonly api=`${environment.apiUrl}/treinamentos`;
  listar(){return this.http.get<CursoTreinamento[]>(this.api);}
  criar(curso:Omit<CursoTreinamento,'id'>){return this.http.post<CursoTreinamento>(this.api,curso);}
  atualizar(id:number,curso:Omit<CursoTreinamento,'id'>){return this.http.put<CursoTreinamento>(`${this.api}/${id}`,curso);}
  turmas(){return this.http.get<ParticipacaoTreinamento[]>(`${this.api}/turmas`);}
  criarTurma(turma:{treinamentoId:number;data:string;horario:string;funcionarioIds:number[]}){return this.http.post<TurmaTreinamento>(`${this.api}/turmas`,turma);}
  atualizarPresenca(turmaId:number,funcionarioId:number,presente:boolean){return this.http.patch<void>(`${this.api}/turmas/${turmaId}/participantes/${funcionarioId}`,{presente});}
}
