import { FuncionarioResponse } from './funcionario';

export interface Epi {
	id: number;
	nome: string;
	ca: number;
	lote: string;
	vencimento: string;
	substituido: boolean;
 descartadoEm?:string|null;
 dataDescarte?:string|null;
 motivoDescarte?:string|null;
 responsavelDescarteId?:number|null;
	// Funcionários vinculados a esse EPI.
	funcionarios: FuncionarioResponse[];
}

// Dados utilizados pelo POST /epis.
export interface EpiRequest {
	nome: string;
	ca: number;
	lote: string;
	vencimento: string;
	substituido: boolean;
	funcionarioIds: number[];
}

// Estrutura utilizada somente pelo POST /epis/bulk.
export interface EpiCreateRequest {
	// Lista de EPIs a serem criados.
	epis: EpiRequest[];
}

// Atualização completa de um EPI.
export interface EpiUpdateRequest extends EpiRequest { }


// Resposta do endpoint de cadastro em lote.
export interface EpiBulkCreateResponse {
	// EPIs efetivamente criados.
	items: EpiResponse[];
}

// Resposta individual da API.
export interface EpiResponse {
	id: number;
	nome: string;
	ca: number;
	lote: string;
	vencimento: string;
	substituido: boolean;
 descartadoEm?:string|null;
 dataDescarte?:string|null;
 motivoDescarte?:string|null;
 responsavelDescarteId?:number|null;
	funcionarios: FuncionarioResponse[];
}

export interface EntregaEpiItem {
 id:number; epiId:number; ca:number; nome:string; vencimento:string;
 encerradoEm:string|null; motivoEncerramento:string|null;
}
export interface EntregaEpiResponse {
 id:number; funcionarioId:number; funcionarioNome:string; dataEntrega:string; responsavelId:number;
 itens:EntregaEpiItem[];
}
export interface EntregaEpiRequest {funcionarioId:number;dataEntrega:string;epiIds:number[];}
