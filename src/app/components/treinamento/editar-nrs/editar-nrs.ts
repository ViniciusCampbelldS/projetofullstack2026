import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nr, NrRequest } from '../../../models/nr';
import { NrService } from '../../../services/nr.service';
import { AuthService } from '../../../services/auth/auth';

@Component({selector:'app-editar-nrs', standalone:true, imports:[FormsModule], templateUrl:'./editar-nrs.html', styleUrl:'./editar-nrs.scss'})
export class EditarNrs implements OnInit {
  private readonly service = inject(NrService);
  private readonly auth = inject(AuthService);
  nrs: Nr[] = []; busca = ''; id: number | null = null; nome = ''; validade: number | null = null;
  editando = false; carregando = false; salvando = false; erro = ''; mensagem = '';
  get podeEditar() { return this.auth.podeEditarTreinamento(); }
  get filtradas() { const q = this.busca.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return this.nrs.filter(n => `${n.id} ${n.nome}`.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)); }
  ngOnInit() { this.carregar(); }
  carregar() { this.carregando = true; this.erro = ''; this.service.listar().subscribe({next: n => {this.nrs = n.sort((a,b)=>a.id-b.id); this.carregando=false;}, error: () => {this.erro='N\u00e3o foi poss\u00edvel carregar as NRs.'; this.carregando=false;}}); }
  editar(n: Nr) { this.id=n.id; this.nome=n.nome; this.validade=n.validadeMeses ?? null; this.editando=true; this.erro=''; this.mensagem=''; }
  cancelar() { this.id=null; this.nome=''; this.validade=null; this.editando=false; }
  salvar() {
    if (!this.podeEditar || this.salvando) return;
    if (this.id === null || !Number.isInteger(this.id) || this.id < 0 || !this.nome.trim() || (this.validade !== null && (!Number.isFinite(this.validade) || this.validade <= 0))) { this.erro='Informe n\u00famero, nome e validade v\u00e1lidos.'; return; }
    const dados: NrRequest = {id:this.id, nome:this.nome.trim(), validadeMeses:this.validade};
    this.salvando=true; this.erro=''; this.mensagem='';
    const req=this.editando ? this.service.atualizar(this.id,dados) : this.service.cadastrar(dados);
    req.subscribe({next:()=>{this.salvando=false;this.cancelar();this.mensagem='NR salva com sucesso.';this.carregar();},error:e=>{this.salvando=false;this.erro=e?.error?.message ?? 'N\u00e3o foi poss\u00edvel salvar a NR.';}});
  }
  excluir(n: Nr) { if (!this.podeEditar || this.salvando || !window.confirm(`Excluir ${n.nome}?`)) return; this.salvando=true;this.service.excluir(n.id).subscribe({next:()=>{this.salvando=false;this.mensagem='NR exclu\u00edda.';this.carregar();},error:e=>{this.salvando=false;this.erro=e?.error?.message ?? 'N\u00e3o foi poss\u00edvel excluir a NR; ela pode estar vinculada.';}}); }
}
