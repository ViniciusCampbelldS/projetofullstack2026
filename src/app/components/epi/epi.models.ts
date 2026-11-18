export interface EmployeeEpi {
 objectKey?:string;
  ca: string;
  name: string;
  deliveredAt: string;
  status: string;
}

export interface Epi {
  id: number;
  nome: string;
  ca: string;
  funcionario: string;
  vencimento: Date | string | null;
}
