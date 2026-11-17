import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface EmployeeTraining {
  id: number;
 diasAviso?:number;
  nr: string;
  trainingDate: string;
  dueDate: string;
}

@Component({
  selector: 'app-meus-treinamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-treinamentos.html',
  styleUrl: './meus-treinamentos.scss',
})
export class MeusTreinamentos {
  employeeTrainings:EmployeeTraining[]=[];
  erro='';
  constructor(http:HttpClient){http.get<Array<{id:number;nr:string;data:string;vencimento:string;diasAviso:number}>>(`${environment.apiUrl}/portal/treinamentos`).subscribe({next:items=>{const br=(value:string)=>value?value.split('-').reverse().join('/'):'';this.employeeTrainings=items.map(t=>({id:t.id,nr:t.nr,trainingDate:br(t.data),dueDate:br(t.vencimento),diasAviso:t.diasAviso}));},error:()=>{this.erro='Não foi possível carregar seus treinamentos.';}});}

  situacaoTreinamento(treinamento: EmployeeTraining): string {
    const vencimento = this.dataBrParaDate(treinamento.dueDate);
    if(Number.isNaN(vencimento.getTime()))return "Sem vencimento informado";
    const hoje = this.inicioDoDia(new Date());
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + (treinamento.diasAviso??30));

    if (vencimento < hoje) {
      return 'Vencido';
    }

    if (vencimento <= limite) {
      return 'Próximo do vencimento';
    }

    return 'Ativo';
  }

  classeTreinamento(treinamento: EmployeeTraining): string {
    const situacao = this.situacaoTreinamento(treinamento);

    if (situacao === 'Vencido') {
      return 'danger';
    }

    if (situacao === 'Próximo do vencimento') {
      return 'warning';
    }

    return 'good';
  }

  private dataBrParaDate(data: string): Date {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  private inicioDoDia(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
}
