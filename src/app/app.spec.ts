import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should close notifications when clicking outside', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.notificacoesAbertas = true;
    app.configuracaoAberta = true;

    app.fecharNotificacoesSeClicarFora({
      target: document.createElement('div'),
    } as unknown as MouseEvent);

    expect(app.notificacoesAbertas).toBeFalsy();
    expect(app.configuracaoAberta).toBeFalsy();
  });
});
