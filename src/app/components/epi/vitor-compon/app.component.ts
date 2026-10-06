import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Funcionario } from '../../../models/funcionario';
import { Epi, EpiRequest } from '../../../models/epi';
import { EpiService } from '../../..//services/epi.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private readonly epiService =
    inject(EpiService);

  private readonly formBuilder =
    inject(FormBuilder).nonNullable;

  epis: Epi[] = [];
  epiEditandoId: number | null = null;
  mensagem = '';
  erro = '';

  formulario = this.formBuilder.group({
    nome: ['', Validators.required],
    descricao: [''],
    preco: [0.01, [
      Validators.required,
      Validators.min(0.01)
    ]],
    quantidade: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    funcionarioId: [0, Validators.min(1)]
  });

  ngOnInit(): void {
    this.carregarEpis();
  }

  carregarEpis(): void {
    this.epiService.listar().subscribe({
      next: epis => {
        this.epis = epis;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os epis.';
      }
    });
  }



  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const request: EpiRequest =
      this.formulario.getRawValue();

    const operacao = this.epiEditandoId === null
      ? this.epiService.cadastrar(request)
      : this.epiService.atualizar(
          this.epiEditandoId,
          request
        );

    operacao.subscribe({
      next: () => {
        this.mensagem = this.epiEditandoId === null
          ? 'Epi cadastrado com sucesso.'
          : 'Epi atualizado com sucesso.';

        this.cancelarEdicao();
        this.carregarEpis();
      },
      error: () => {
        this.erro = 'Não foi possível salvar o epi.';
      }
    });
  }

  editar(epi: Epi): void {
    this.epiEditandoId = epi.id;

    this.formulario.setValue({
      nome: epi.nome,
      descricao: epi.descricao ?? '',
      preco: epi.preco,
      quantidade: epi.quantidade,
      funcionarioId: epi.funcionario.id
    });
  }

  excluir(epi: Epi): void {
    const confirmou = confirm(
      `Deseja excluir o epi ${epi.nome}?`
    );

    if (!confirmou) {
      return;
    }

    this.epiService.excluir(epi.id).subscribe({
      next: () => {
        this.mensagem = 'Epi excluído com sucesso.';
        this.carregarEpis();
      },
      error: () => {
        this.erro = 'Não foi possível excluir o epi.';
      }
    });
  }

  cancelarEdicao(): void {
    this.epiEditandoId = null;

    this.formulario.reset({
      nome: '',
      descricao: '',
      preco: 0.01,
      quantidade: 0,
      funcionarioId: 0
    });
  }
}
