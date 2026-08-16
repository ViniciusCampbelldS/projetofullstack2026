import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BuscaEpi } from './busca-epi/busca-epi';
import { EntregaEpi } from './entrega-epi/entrega-epi';
import { HistóricoAltEpi } from './historico-alt-epi/historico-alt-epi';
import { EpiStatus } from './epi-status/epi-status';

type SstView = 'busca' | 'cadastro' | 'entrega' | 'historico';

@Component({
  selector: 'app-epi-seletor',
  standalone: true,
  imports: [CommonModule, RouterModule, BuscaEpi, EpiStatus, EntregaEpi, HistóricoAltEpi],
  templateUrl: './epi-seletor.html',
  styleUrl: './epi-seletor.scss',
})
export class EpiSeletor implements OnInit {
  activeSstView: SstView = 'busca';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const view = data['view'] as SstView | undefined;
      if (view === 'busca' || view === 'entrega' || view === 'historico') {
        this.activeSstView = view;
      }
    });

    this.route.queryParams.subscribe((params) => {
      const view = params['view'] as SstView | undefined;
      if (view === 'busca' || view === 'entrega' || view === 'historico') {
        this.activeSstView = view;
      }
    });
  }

  setSstView(view: SstView): void {
    this.activeSstView = view;
  }
}
