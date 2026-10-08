import { FuncionarioResponse } from './funcionario';

status: FuncionarioStatus;
export interface Epi {
	id: number;
	nome: string;
	ca: string;
	lote: string;
	vencimento: string;
	substituido: boolean;
	// Funcionários vinculados a esse EPI.
	funcionarios: FuncionarioResponse[];
}

// Dados utilizados pelo POST /epis.
export interface EpiRequest {
	nome: string;
	ca: string;
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
	ca: string;
	lote: string;
	vencimento: string;
	substituido: boolean;
	funcionarios: FuncionarioResponse[];
}
