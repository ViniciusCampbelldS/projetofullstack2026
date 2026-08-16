import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { output } from '@angular/core';
import { EpiData } from '../../../services/epi-data';
import { PreviousEpi } from '../../../components/epi/epi.models';

@Component({
  selector: 'app-replace-epi-modal',
  imports: [CommonModule],
  templateUrl: './replace-epi-modal.html',
  styleUrl: './replace-epi-modal.scss',
})
export class ReplaceEpiModal {
  closed = output<void>();
  previousEpis: PreviousEpi[];

  constructor(private readonly epiData: EpiData) {
    this.previousEpis = this.epiData.getPreviousEpis();
  }
}
