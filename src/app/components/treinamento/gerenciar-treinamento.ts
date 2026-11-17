import { Component } from '@angular/core';
import { AlteraTreinamento } from './altera-treinamento/altera-treinamento';

@Component({
  selector: 'app-gerenciar-treinamento',
  standalone: true,
  imports: [AlteraTreinamento],
  template: '<app-altera-treinamento></app-altera-treinamento>'
})
export class GerenciarTreinamento {}
