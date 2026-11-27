import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { AuthService } from '../../../services/auth/auth';
import { Login } from './login';

describe('Carregamento do login', () => {
  it('mostra apenas o carregamento durante a autenticação e restaura o formulário em caso de erro', () => {
    const resposta = new Subject<any>();
    TestBed.configureTestingModule({ imports: [Login], providers: [
      { provide: AuthService, useValue: { login: () => resposta, carregarUsuario: () => of({}), limpar: () => {} } },
      { provide: Router, useValue: { navigateByUrl: () => Promise.resolve(true) } },
    ] });
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    fixture.componentInstance.entrar();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.login-loading')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.login-form')).toBeNull();
    resposta.error(new Error('falha'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.login-loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('.login-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });
});
