import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface NrTreinamento { id:number; nome:string; validadeMeses:number|null; }
export interface TurmaTreinamento { id:number; nrId:number; data:string; horario:string; }
export interface ParticipacaoTreinamento extends TurmaTreinamento { nrNome:string; validadeMeses:number; funcionarioId:number; funcionario:string; presente:boolean; }
export interface TreinamentoPortal { id:number; nr:string; nome?:string; data:string; vencimento:string; diasAviso:number; presente:boolean; }

@Injectable({providedIn:'root'})
export class TreinamentoService {
  private readonly http=inject(HttpClient);
  private readonly api=`${environment.apiUrl}/treinamentos`;
  listar(){return this.http.get<NrTreinamento[]>(`${environment.apiUrl}/nrs`);}
  atualizarValidade(nr:NrTreinamento,validadeMeses:number){return this.http.put<NrTreinamento>(`${environment.apiUrl}/nrs/${nr.id}`,{id:nr.id,nome:nr.nome,validadeMeses});}
  turmas(){return this.http.get<ParticipacaoTreinamento[]>(`${this.api}/turmas`);}
  meusTreinamentos(){return this.http.get<TreinamentoPortal[]>(`${environment.apiUrl}/portal/treinamentos`);}
  criarTurma(turma:{nrId:number;data:string;horario:string;funcionarioIds:number[]}){return this.http.post<TurmaTreinamento>(`${this.api}/turmas`,turma);}
  atualizarPresenca(turmaId:number,funcionarioId:number,presente:boolean){return this.http.patch<void>(`${this.api}/turmas/${turmaId}/participantes/${funcionarioId}`,{presente});}
}
