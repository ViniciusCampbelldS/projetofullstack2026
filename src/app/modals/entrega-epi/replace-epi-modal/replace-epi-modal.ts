import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { output } from '@angular/core';
import { EpiService } from '../../../services/epi-service';
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

  constructor(private readonly epiService: EpiService) {
    this.previousEpis = this.epiService.getPreviousEpis();
  }
}
