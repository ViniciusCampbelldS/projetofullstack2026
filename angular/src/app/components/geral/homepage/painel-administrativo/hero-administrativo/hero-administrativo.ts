import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-administrativo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-administrativo.html',
  styleUrl: './hero-administrativo.scss',
})
export class HeroAdministrativo {
  dataHoje = input.required<string>();
  saudacao = input.required<string>();
}
