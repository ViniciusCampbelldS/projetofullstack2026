import {TestBed,ComponentFixture} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting,HttpTestingController} from '@angular/common/http/testing';
import {signal} from '@angular/core';
import {BuscaEpi} from './busca-epi';
import {AuthService} from '../../../services/auth/auth';
import {NotificacaoService} from '../../../services/notificacao';
import {environment} from '../../../../environments/environment';

describe('Cadastro e autocomplete EPI',()=>{
 let fixture:ComponentFixture<BuscaEpi>,component:BuscaEpi,http:HttpTestingController;
 const base=environment.apiUrl;
 beforeEach(()=>{
  TestBed.configureTestingModule({imports:[BuscaEpi],providers:[provideHttpClient(),provideHttpClientTesting(),{provide:AuthService,useValue:{podeEditarEpi:()=>true,obterPerfil:()=> 'Administrador'}},{provide:NotificacaoService,useValue:{regrasAviso:signal([]),todosEpis:[],obterDiasAviso:()=>30,calcularDiasRestantes:()=>365}}]});
  fixture=TestBed.createComponent(BuscaEpi);component=fixture.componentInstance;component.modoCadastro=true;http=TestBed.inject(HttpTestingController);fixture.detectChanges();http.expectOne(base+'/epis').flush([]);
 });
 afterEach(()=>{http.verify();fixture.destroy();});
 it('cancela consulta antiga e preenche nome selecionado sem bloquear nome manual',async()=>{
  component.form.ca='1';component.alterarCa();await new Promise(resolve=>setTimeout(resolve,280));
  const old=http.expectOne(base+'/epis/sugestoes?ca=1');
  component.form.ca='12';component.alterarCa();expect(old.cancelled).toBe(true);
  await new Promise(resolve=>setTimeout(resolve,280));http.expectOne(base+'/epis/sugestoes?ca=12').flush([{ca:12345,nome:'Capacete'}]);
  component.selecionarSugestao(component.sugestoesCa[0]);expect(component.form.ca).toBe('12345');expect(component.form.nome).toBe('Capacete');
  component.form.ca='99';component.alterarCa();expect(component.form.nome).toBe('');
  component.form.nome='Nome manual';await new Promise(resolve=>setTimeout(resolve,280));http.expectOne(base+'/epis/sugestoes?ca=99').flush([]);expect(component.form.nome).toBe('Nome manual');
 });
 it('envia quantidade como objetos físicos e impede clique duplo enquanto salva',()=>{
  Object.assign(component.form,{nome:'Capacete',ca:'12345',lote:'L1',validade:'2030-01-01',quantidade:2});component.salvarEpi();component.salvarEpi();
  const request=http.expectOne(base+'/epis/bulk');expect(request.request.method).toBe('POST');expect(request.request.body.epis).toHaveLength(2);expect(request.request.body.epis[0].ca).toBe(12345);expect(request.request.body.epis[0].funcionarioIds).toEqual([]);
  request.flush({items:[]});expect(component.salvando).toBe(false);
 });
});
