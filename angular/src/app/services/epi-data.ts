import { Injectable } from '@angular/core';
import {
  DeliveryItem,
  EmployeeEpi,
  EpiOption,
  EpiRecord,
  HistoryEntry,
  PreviousEpi,
} from '../components/epi/epi.models';

@Injectable({ providedIn: 'root' })
export class EpiData {
  getAvailableEpis(): EpiOption[] {
    return [
      { name: 'Capacete de segurança', ca: '101022', validity: '2026-09-12' },
      { name: 'Luva anticorte Cut Oil Volk', ca: '34456', validity: '2026-08-28' },
      { name: 'Bota de borracha isolante', ca: '321124', validity: '2026-08-02' },
      { name: 'Óculos de segurança incolor', ca: '88912', validity: '2027-01-10' },
      { name: 'Protetor auricular plug', ca: '67543', validity: '2027-03-04' },
    ];
  }

  getDeliveryDraft(): DeliveryItem[] {
    return [
      {
        epi: 'Capacete de segurança',
        ca: '101022',
        quantity: 1,
        validity: '2026-09-12',
      },
      {
        epi: 'Luva anticorte Cut Oil Volk',
        ca: '34456',
        quantity: 1,
        validity: '2026-08-28',
      },
    ];
  }

  getEpiRecords(): EpiRecord[] {
    return [
      {
        ca: '101022',
        name: 'Capacete com viseira e faixa refletiva',
        employee: 'João Pedro da Rocha de Alcântara',
        status: 'Distante do vencimento',
        statusClass: 'success',
        due: '12/09/2026',
      },
      {
        ca: '34456',
        name: 'Luva anticorte Cut Oil Volk',
        employee: 'Fernanda Beatriz de Lima Barreto',
        status: 'Próximo do vencimento',
        statusClass: 'warning',
        due: '28/08/2026',
      },
      {
        ca: '321124',
        name: 'Bota de borracha isolante',
        employee: 'Marcos Paulo Ferreira Pereira Filho',
        status: 'Vencido',
        statusClass: 'danger',
        due: '02/08/2026',
      },
    ];
  }

  getEmployeeEpis(): EmployeeEpi[] {
    return [
      {
        ca: '101022',
        name: 'Capacete com viseira e faixa refletiva',
        deliveredAt: '06/08/2026',
        status: 'Em uso',
      },
      {
        ca: '34456',
        name: 'Luva anticorte Cut Oil Volk',
        deliveredAt: '06/08/2026',
        status: 'Em uso',
      },
      {
        ca: '67543',
        name: 'Protetor auricular plug',
        deliveredAt: '04/03/2026',
        status: 'Em uso',
      },
    ];
  }

  getPreviousEpis(): PreviousEpi[] {
    return [
      { ca: '88912', name: 'Óculos de segurança incolor', deliveredAt: '10/01/2026' },
      { ca: '67543', name: 'Protetor auricular plug', deliveredAt: '04/03/2026' },
      { ca: '55301', name: 'Luva nitrílica', deliveredAt: '19/04/2026' },
    ];
  }

  getHistory(): HistoryEntry[] {
    return [
      {
        data: '06/08/2026 09:48',
        usuario: 'Admin SST',
        registro: 'CPF 16779645, CA 11022 e 34456',
        alteracao: 'Entrega registrada',
        detalhe: 'Ficha digital criada para João Pedro com 2 EPIs.',
      },
      {
        data: '05/08/2026 16:20',
        usuario: 'Admin SST',
        registro: 'CA 34456',
        alteracao: 'Manual',
        detalhe: 'Alterado o número de dias para notificação de próximo do vencimento para CA 34456.',
      },
      {
        data: '02/08/2026 11:05',
        usuario: 'Admin SST',
        registro: 'CPF 20724369, CA 40271',
        alteracao: 'Substituição',
        detalhe: 'Bota isolante anterior substituída por vencimento.',
      },
    ];
  }
}
