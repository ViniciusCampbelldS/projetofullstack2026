import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PresencaTreinamento } from './presenca-treinamento/presenca-treinamento';
import { AlteraTreinamento } from './altera-treinamento/altera-treinamento';

type TreinamentoView =
  | 'presenca'
  | 'abrir-turma';

@Component({
  selector: 'app-gerenciar-treinamento',
  standalone: true,
  imports: [CommonModule, AlteraTreinamento, PresencaTreinamento],
  template: `
    @if (activeView === 'presenca') {
      <app-altera-treinamento></app-altera-treinamento>
    }

    @if (activeView === 'abrir-turma') {
      <app-abre-treinamento></app-abre-treinamento>
    }
  `
})
export class GerenciarTreinamento implements OnInit, OnDestroy {
  activeView: TreinamentoView = 'presenca';
  private routeDataSubscription?: Subscription;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      this.setActiveView(data['view'] as TreinamentoView | undefined);
    });
  }

  ngOnDestroy(): void {
    this.routeDataSubscription?.unsubscribe();
  }

  private setActiveView(view: TreinamentoView | undefined): void {
    if (view === 'presenca' || view === 'abrir-turma') {
      this.activeView = view;
      return;
    }

    this.activeView = 'presenca';
  }
}
