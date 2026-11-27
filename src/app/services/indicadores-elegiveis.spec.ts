import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { NotificacaoService } from './notificacao';
import { AuthService } from './auth/auth';
import { environment } from '../../environments/environment';
import { AlteraTreinamento } from '../components/treinamento/altera-treinamento/altera-treinamento';
import { Homepage } from '../components/geral/homepage/homepage';

describe('Indicadores de conformidade', () => {
  it('exclui EPIs substituídos, descartados ou com posse somente de inativos, mantendo estoque', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: AuthService, useValue: { podeVerAdministracao: () => true } }] });
    const service = TestBed.inject(NotificacaoService);
    const http = TestBed.inject(HttpTestingController);
    service.carregarEpis().subscribe();
    const epi = (id: number, extra: object) => ({ id, ca: id, nome: 'EPI', vencimento: '2020-01-01', funcionarios: [], substituido: false, ...extra });
    http.expectOne(environment.apiUrl + '/epis').flush([
      epi(1, {}), epi(2, {substituido:true}), epi(3, {dataDescarte:'2020-01-01'}),
      epi(4, {funcionarios:[{nome:'Inativo',status:'In'}]}), epi(5, {funcionarios:[{nome:'Ativo',status:'At'}]}),
      epi(6, {funcionarios:[{nome:'Afastado',status:'Af'}]})
    ]);
    expect(service.totalEpis).toBe(3);
    expect(service.episVencidos.map(e => e.id)).toEqual([1, 5, 6]);
    http.verify();
  });

  it('ignora participações e turmas exclusivas de inativos nos cards', () => {
    const c = new AlteraTreinamento({} as any, {} as any, {} as any, {obterDiasAviso:()=>30} as any);
    c.funcionarios = [{id:1,status:'Ativo'},{id:2,status:'Inativo'},{id:3,status:'Afastado'}] as any;
    c.treinamentos = [
      {id:1,aplicacao:'2000-01-01',participantes:[{funcionarioId:1,presente:true,validadeMeses:12,data:'2000-01-01',nrId:1},{funcionarioId:2,presente:true,validadeMeses:12,data:'2000-01-01',nrId:1}]},
      {id:2,aplicacao:'2000-01-01',participantes:[{funcionarioId:2,presente:true,validadeMeses:12,data:'2000-01-01',nrId:1}]},
      {id:3,aplicacao:'2000-01-01',participantes:[{funcionarioId:3,presente:true,validadeMeses:12,data:'2000-01-01',nrId:1}]}
    ] as any;
    expect(c.totalTurmas).toBe(2);
    expect(c.participacoesVencidas).toBe(2);
  });

  it('considera apenas funcionários elegíveis na visão geral', () => {
    const c = new Homepage({obterDataAtualFormatada:()=>''} as any,{obterPerfil:()=> 'Administrador'} as any,{} as any,{} as any);
    (c as any).funcionariosElegiveis = new Set([1,3]);
    (c as any).participacoesTreinamento = [1,2,3].map(funcionarioId => ({funcionarioId,presente:true,validadeMeses:12,data:'2000-01-01'}));
    expect(c.totalTreinamentos).toBe(2);
    expect(c.treinamentosVencidos).toBe(2);
  });
});
