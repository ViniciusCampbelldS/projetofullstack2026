import { TestBed } from '@angular/core/testing';
import { NotificacaoService } from '../../../services/notificacao';
import { EpiStatus } from './epi-status';

describe('EpiStatus', () => {
  it('exibe os totais fornecidos pelo serviço de notificação', () => {
    TestBed.configureTestingModule({
      imports: [EpiStatus],
      providers: [{
        provide: NotificacaoService,
        useValue: { totalEpis: 6, episEmDia: 3, episProximos: 2, episVencidos: 1 },
      }],
    });

    const component = TestBed.createComponent(EpiStatus).componentInstance;
    expect(component.totalEpis).toBe(6);
    expect(component.episEmDia).toBe(3);
    expect(component.episProximos).toBe(2);
    expect(component.episVencidos).toBe(1);
  });
});
