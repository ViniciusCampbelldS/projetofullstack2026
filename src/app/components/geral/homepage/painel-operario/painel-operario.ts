import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-painel-operario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-operario.html',
  styleUrl: './painel-operario.scss',
})
export class PainelOperario {
  saudacao = input.required<string>();
  funcionario = input.required<any>();
  resumoFuncionario = input.required<any[]>();
  pendenciasFuncionario = input.required<any[]>();
}
