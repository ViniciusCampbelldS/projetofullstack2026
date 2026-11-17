import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
export type UserRole = 'Técnico de Segurança do Trabalho' | 'Funcionário' | 'RH' | 'Gerência' | 'Administrador';
export interface Usuario { id:number; nome:string; email:string; permissoes:string; cargo?:string;setor?:string; }
@Injectable({providedIn:'root'})
export class AuthService {
 private apiUrl = `${environment.apiUrl}/auth`;
 private user: Usuario | null = null;
 constructor(private http:HttpClient){}
 login(dados:{email:string;senha:string}) { return this.http.post<{access_token:string}>(`${this.apiUrl}/login`,dados).pipe(timeout(10000),tap(r=>this.salvarToken(r.access_token))); }
 carregarUsuario():Observable<Usuario>{return this.http.get<Usuario>(`${this.apiUrl}/me`).pipe(timeout(10000),tap(u=>this.user=u));}
 inicializar():Observable<Usuario|null>{return this.obterToken()?this.carregarUsuario():of(null);}
 recuperar(email:string){return this.http.post<{mensagem:string}>(`${this.apiUrl}/recuperar-senha`,{email});}
 redefinir(token:string,senha:string){return this.http.post<void>(`${this.apiUrl}/redefinir-senha`,{token,senha});}
 salvarToken(token:string){sessionStorage.setItem('token',token);}
 obterToken(){return sessionStorage.getItem('token');}
 get usuario(){return this.user;}
 get funcionarioId(){return this.user?.id;}
 obterPerfil():UserRole {return ({ADM:'Administrador',tst:'Técnico de Segurança do Trabalho',rh:'RH',gerencia:'Gerência',field:'Funcionário'} as Record<string,UserRole>)[this.user?.permissoes??'']??'Funcionário';}
 podeEditarEpi(){return ['ADM','tst','gerencia'].includes(this.user?.permissoes??'');}
 podeEditarTreinamento(){return this.podeEditarEpi();}
 podeCadastrarFuncionario(){return ['ADM','rh','gerencia'].includes(this.user?.permissoes??'');}
 podeVerAdministracao(){return !!this.user && this.user.permissoes!=='field';}
 apenasVisualizacao(){return !this.podeEditarEpi();}
 isAuthenticated(){return !!this.obterToken() && !!this.user;}
 limpar(){this.user=null;sessionStorage.removeItem('token');sessionStorage.removeItem('userRole');}
 logout(){this.http.post<void>(`${this.apiUrl}/logout`,{}).pipe(finalize(()=>{this.limpar();window.location.assign('/login');})).subscribe({error:()=>{}});}
}
