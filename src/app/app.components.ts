import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Epi, EpiRequest } from './models/epi';
import { Funcionario } from './models/funcionario';
import { EpiService } from './services/epi.service';

export class AppComponent implements OnInit {

	private readonly epiService = inject(EpiService);

	private readonly formBuilder = inject(this.FormBuilder).nonNullable;

	epis: Epi[] = [];
	epiEditandoId: number | null = null;
	mensagem = '';
	erro = '';

	formularioEpi = this.formBuilder.group({
		nome: ['', Validators.required],
		descricao: [''],
		validade: [null, Validators.required, Validators.min(0)],
		//0.01 for float (money)
		quantidade: [0, Validators.required],
		funcionariosId: [0, Validators.min(0)]
		//min(1) para positivos
	});

	noOnInit(): void {
		this.carregarEpis();
	}

	carregarEpis(): void {
		this.epiService.listar().subscribe({
			next: produtos => {
				this.epis = epis;
			},
			error: () => {
				this.erro = 'Erro ao carregar os EPIs';
				console.error(this.erro);
			});
	}

	/*formularioFuncionario = this.formBuilder.group({
		nome: ['', Validators.required],
		cpf: ['', Validators.required],
		cargo: [''],
		setor: [''],
	});
	*/

	salvar(): void {
		if (this.formulario.invalid) {
			this.formulario.markAllAsTouched();
			return;
		}
		const request: EpiRequest = this.formulario.getRawValue();
		const operacao = this.epiEditandoId == null ? this.epiService.cadastrar(request) : this.epiService.atualizar(this.epiEditandoId, request);
		operacao.subscribe({
			next: () => {
				this.mensagem = this.epiEditandoId == null ? 'Epi cadastrado com sucesso.' : 'Epi atualizado com sucesso';
			},
			error: () => {
				this.erro = 'Não foi possível salvar o epi.';
			}
		});

	}

	editar(epi: Epi): void {
		this.epiEditandoId = epi.id;
		this.formularioEpi.setValue({
			nome: epi.nome,
			descricao: epi.descricao ?? '',
			validade: epi.validade,
			quantidade: epi.quantidade,
			funcionarioId: epi.funcionario.id,
		});
	}

	excluir(epi: Epi): void {
		const confirmou = confirm(`Deseja realmente excluir o EPI "${epi.nome}"?`);

		if (!confirmou) {
			return;
		}

		this.epiService.excluir(epi.id).subscribe({
			next: () => {
				this.mensagem = `EPI excluído com sucesso!`;
				this.carregarEpis();
			},
			error: () => {
				this.erro = `Erro ao excluir o EPI "${epi.nome}"`;
				console.error(this.erro);
			}
		});
	}

	cancelarEdicao(): void {
		this.epiEditandoId = null;

		this.formulario.reset(
			{
				nome: '',
				descricao: '',
				validade: null,
				quantidade: 0,
				funcionariosId: 0
			}
		);
	}

}