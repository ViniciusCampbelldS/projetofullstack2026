import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth/auth';
@Component({selector:'app-login',standalone:true,imports:[FormsModule],templateUrl:'./login.html',styleUrl:'./login.scss'})
export class Login {
 cpf='';senha='';carregando=false;erroLogin=false;mensagemErroLogin='';emailRecuperacao='';recuperacao=false;mensagem='';
 constructor(private auth:AuthService,private router:Router){}
 entrar(){if(this.carregando)return;this.carregando=true;this.erroLogin=false;this.auth.login({email:this.cpf,senha:this.senha}).pipe(switchMap(()=>this.auth.carregarUsuario())).subscribe({next:()=>{this.carregando=false;this.router.navigateByUrl('/');},error:()=>{this.auth.limpar();this.carregando=false;this.erroLogin=true;this.mensagemErroLogin='Acesso inválido ou indisponível. Confira suas credenciais.';}});}
 recuperar(){if(this.carregando)return;this.carregando=true;this.auth.recuperar(this.emailRecuperacao).subscribe({next:r=>{this.mensagem=r.mensagem;this.carregando=false;},error:()=>{this.mensagem='Não foi possível concluir. Aguarde e tente novamente.';this.carregando=false;}});}
}
