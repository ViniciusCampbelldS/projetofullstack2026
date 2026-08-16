// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { EpiService } from '../../epi/epi';

// @Component({
//   selector: 'app-epi-form',
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './epi-form.html',
//   styleUrl: './epi-form.scss',
// })
// export class EpiForm {
//   private readonly fb = inject(FormBuilder);
//   private readonly epiService = inject(EpiService);
//   private readonly router = inject(Router);

//   saveError = '';

//   formulario = this.fb.nonNullable.group({
//     nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
//     ca: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
//     funcionarios: ['', [Validators.required, Validators.minLength(3)]],
//     vencimento: ['', Validators.required],
//   });

//   salvar(): void {
//     if (this.formulario.invalid) {
//       this.formulario.markAllAsTouched();
//       return;
//     }

//     this.epiService.cadastrar(this.formulario.getRawValue()).subscribe({
//       next: () => this.router.navigate(['/epi']),
//       error: () => {
//         this.saveError = 'Backend indisponivel. Cadastro mantido apenas como prototipo.';
//       },
//     });
//   }
// }
