export interface Epi {
	id: number;
	nome: string;
	descricao: string;
	validade: number;
	funcionarios: unknown;
	substituido?: boolean;
}

export interface EpiRequest {
	nome: string;
	ca: string;
	lote: string;
	validade: string;
}

export interface EpiCreateRequest extends EpiRequest {
	quantidade: number;
	substituido?: never;
}

export interface EpiUpdateRequest extends EpiRequest {
	substituido: boolean;
}

export interface EpiBulkCreateResponse {
	quantidade: number;
	epis: EpiResponse[];
}

export interface EpiResponse {
	id: number;
	nome: string;
	ca: string;
	lote?: string;
	validade?: string;
	funcionario?: string;
	vencimento?: string;
	funcionarioIds?: number[];
	substituido?: boolean;
}

