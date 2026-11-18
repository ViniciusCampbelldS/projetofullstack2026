export interface DeliveryItem {
  epi: string;
  ca: string;
  quantity: number;
  validity: string;
}

export interface EpiRecord {
  ca: string;
  name: string;
  employee: string;
  status: string;
  statusClass: 'success' | 'warning' | 'danger';
  due: string;
}

export interface EmployeeEpi {
 objectKey?:string;
  ca: string;
  name: string;
  deliveredAt: string;
  status: string;
}

export interface HistoryEntry {
  data: string;
  usuario: string;
  registro: string;
  alteracao: string;
  detalhe: string;
}

export interface Epi {
  id: number;
  nome: string;
  ca: string;
  funcionario: string;
  vencimento: Date | string | null;
}
