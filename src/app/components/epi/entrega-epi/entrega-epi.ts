import {Component,OnInit,DestroyRef,inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {forkJoin,Subject,switchMap,of,catchError,finalize,defer} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EpiService} from '../../../services/epi.service';
import {FuncionarioService} from '../../../services/funcionario.service';
import {AuthService} from '../../../services/auth/auth';
import {FuncionarioResponse} from '../../../models/funcionario';
import {EpiResponse,EntregaEpiResponse} from '../../../models/epi';
@Component({selector:'app-entrega-epi',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./entrega-epi.html',styleUrls:['./entrega-epi.scss']})
export class EntregaEpi implements OnInit {
 private readonly api=inject(EpiService);private readonly funcionariosApi=inject(FuncionarioService);private readonly auth=inject(AuthService);private readonly destroyRef=inject(DestroyRef);
 private readonly funcionarioMudou=new Subject<number|null>();
 funcionarios:FuncionarioResponse[]=[];disponiveis:EpiResponse[]=[];entregas:EntregaEpiResponse[]=[];
 funcionarioId:number|null=null;selecionados=new Set<number>();buscaFuncionario='';buscaEpi='';
 ficha: File | null = null;
 erroFicha = '';
 erroDownload = '';
 dataEntrega=this.hoje();carregando=false;carregandoEntregas=false;salvando=false;confirmacao=false;erro='';erroEntregas='';mensagem='';
 constructor(){this.funcionarioMudou.pipe(switchMap(id=>defer(()=>{
   this.erroEntregas='';this.entregas=[];if(id===null){this.carregandoEntregas=false;return of([]);}
   this.carregandoEntregas=true;
   return this.api.listarEntregas(id).pipe(catchError(()=>{this.erroEntregas='Não foi possível consultar as entregas deste funcionário.';return of([]);}),finalize(()=>this.carregandoEntregas=false));
 })),takeUntilDestroyed(this.destroyRef)).subscribe(items=>this.entregas=items);}
 ngOnInit(){this.carregar();}
 get podeGerenciar(){return this.auth.podeEditarEpi();}
 get funcionariosFiltrados(){const q=this.normalizar(this.buscaFuncionario);return this.funcionarios.filter(f=>f.status!=='In'&&(f.id===this.funcionarioId||!q||this.normalizar(f.nome+' '+f.cpf).includes(q)));}
 get episFiltrados(){const q=this.normalizar(this.buscaEpi);return this.disponiveis.filter(e=>!q||this.normalizar(`${e.id} ${e.ca} ${e.nome} ${e.lote}`).includes(q));}
 get itensSelecionados(){return this.disponiveis.filter(e=>this.selecionados.has(e.id));}
 get funcionarioSelecionado(){return this.funcionarios.find(f=>f.id===this.funcionarioId);}
 get podeSalvar(){return this.podeGerenciar&&!this.salvando&&!this.carregando&&this.funcionarioId!==null&&!!this.funcionarioSelecionado&&this.funcionarioSelecionado.status!=='In'&&this.selecionados.size>0&&this.itensSelecionados.length===this.selecionados.size&&/^\d{4}-\d{2}-\d{2}$/.test(this.dataEntrega)&&this.dataEntrega<=this.hoje()&&!this.erroFicha;}
 carregar(){this.carregando=true;this.erro='';forkJoin([this.funcionariosApi.listar(),this.api.listarDisponiveis()]).pipe(finalize(()=>this.carregando=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:([funcionarios,epis])=>{this.funcionarios=funcionarios;this.disponiveis=epis;this.selecionados=new Set([...this.selecionados].filter(id=>epis.some(e=>e.id===id)));},error:()=>{this.erro='Não foi possível carregar funcionários e EPIs disponíveis. Tente novamente.';}});}
 selecionarFuncionario(){this.confirmacao=false;this.funcionarioMudou.next(this.funcionarioId);}
 marcar(id:number,checked:boolean){this.confirmacao=false;const next=new Set(this.selecionados);checked?next.add(id):next.delete(id);this.selecionados=next;}
 confirmar(){if(this.podeSalvar){this.confirmacao=true;this.erro='';}}
 selecionarFicha(campo: HTMLInputElement) {
   this.confirmacao = false;
   this.ficha = campo.files?.item(0) ?? null;
   this.erroFicha = '';
   if (this.ficha && (!/\.pdf$/i.test(this.ficha.name) || !this.ficha.size || this.ficha.size > 5 * 1024 * 1024)) {
     this.erroFicha = 'Selecione um PDF de até 5 MB.';
   }
 }

 baixarFicha(entrega: EntregaEpiResponse) {
   if (!entrega.fichaNome) return;
   this.erroDownload = '';
   this.api.baixarFicha(entrega.id, entrega.fichaNome).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
     error: () => this.erroDownload = 'Não foi possível baixar a ficha.',
   });
 }

 salvar(campoFicha: HTMLInputElement){if(!this.podeSalvar||!this.confirmacao)return;this.salvando=true;this.erro='';this.mensagem='';
 const id=this.funcionarioId!;const ids=[...this.selecionados];
 this.api.entregar({funcionarioId:id,dataEntrega:this.dataEntrega,epiIds:ids},this.ficha).pipe(finalize(()=>this.salvando=false),takeUntilDestroyed(this.destroyRef)).subscribe({next:res=>{
  campoFicha.value = '';
  this.ficha = null;
  this.mensagem=`Entrega #${res.id} registrada para ${this.funcionarioSelecionado?.nome??'o funcionário'}.`;
  this.disponiveis=this.disponiveis.filter(e=>!ids.includes(e.id));this.selecionados=new Set();this.confirmacao=false;this.funcionarioMudou.next(id);
 },error:e=>{this.confirmacao=false;this.carregar();this.erro=e.status === 413 ? 'A ficha deve ter até 5 MB.' : (e?.error?.detail??e?.error?.message??'Não foi possível registrar a entrega. Confira o PDF e os objetos selecionados.');}});
 }
 private hoje(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 private normalizar(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();}
}
