import {TestBed,ComponentFixture} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting,HttpTestingController} from '@angular/common/http/testing';
import {EntregaEpi} from './entrega-epi';
import {AuthService} from '../../../services/auth/auth';
import {environment} from '../../../../environments/environment';

describe('Entrega real de objetos EPI',()=>{
 let component:EntregaEpi,fixture:ComponentFixture<EntregaEpi>,http:HttpTestingController;
 const base=environment.apiUrl;
 const employee={id:7,nome:'Funcionário',cpf:'12345678901',status:'At'};
 const epis=[{id:11,ca:12345,nome:'Capacete',lote:'L1',vencimento:'2030-01-01',substituido:false,funcionarios:[]},{id:12,ca:12345,nome:'Capacete',lote:'L1',vencimento:'2030-01-01',substituido:false,funcionarios:[]}];
 beforeEach(()=>{TestBed.configureTestingModule({imports:[EntregaEpi],providers:[provideHttpClient(),provideHttpClientTesting(),{provide:AuthService,useValue:{podeEditarEpi:()=>true}}]});fixture=TestBed.createComponent(EntregaEpi);component=fixture.componentInstance;http=TestBed.inject(HttpTestingController);fixture.detectChanges();http.expectOne(base+'/funcionarios').flush([employee]);http.expectOne(base+'/epis/disponiveis').flush(epis);});
 afterEach(()=>{http.verify();fixture.destroy();});
 it('usa IDs físicos distintos mesmo com CA igual e confirma somente após resposta da API',()=>{
  expect(component.funcionarioId).toBeNull();expect(component.podeSalvar).toBe(false);
  component.funcionarioId=7;component.selecionarFuncionario();http.expectOne(base+'/entregas-epis?funcionarioId=7').flush([]);
  component.marcar(11,true);component.marcar(12,true);component.marcar(11,true);component.confirmar();component.salvar(document.createElement('input'));component.salvar(document.createElement('input'));
  const req=http.expectOne(base+'/entregas-epis');expect(req.request.method).toBe('POST');expect(req.request.body.epiIds).toEqual([11,12]);expect(req.request.body.funcionarioId).toBe(7);expect(component.mensagem).toBe('');
  req.flush({id:5});http.expectOne(base+'/entregas-epis?funcionarioId=7').flush([]);
  expect(component.mensagem).toContain('#5');expect(component.selecionados.size).toBe(0);expect(component.disponiveis).toEqual([]);
 });
 it('bloqueia funcionário não selecionado, objeto inexistente e data futura',()=>{
  component.marcar(11,true);expect(component.podeSalvar).toBe(false);component.funcionarioId=7;expect(component.podeSalvar).toBe(true);
  component.marcar(999,true);expect(component.podeSalvar).toBe(false);component.marcar(999,false);component.dataEntrega='2999-01-01';expect(component.podeSalvar).toBe(false);component.confirmar();component.salvar(document.createElement('input'));http.expectNone(base+'/entregas-epis');
 });
 it('envia a ficha e a entrega no mesmo POST multipart', () => {
  component.funcionarioId = 7;
  component.marcar(11, true);
  const campo = document.createElement('input');
  const ficha = new File(['%PDF-1.7'], 'ficha.pdf', { type: 'application/pdf' });
  Object.defineProperty(campo, 'files', { value: { item: () => ficha } });
  component.selecionarFicha(campo);
  component.confirmar();
  component.salvar(campo);

  const req = http.expectOne(base + '/entregas-epis');
  const dados = req.request.body as FormData;
  expect(dados.get('ficha')).toEqual(ficha);
  expect((dados.get('entrega') as Blob).type).toBe('application/json');

  req.flush({ id: 5, fichaNome: ficha.name });
  http.expectOne(base + '/entregas-epis?funcionarioId=7').flush([]);
  expect(component.ficha).toBeNull();
 });
});
