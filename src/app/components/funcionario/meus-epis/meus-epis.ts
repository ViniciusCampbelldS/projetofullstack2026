import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeEpi } from '../../epi/epi.models';
import { EpiService } from '../../../services/epi.service';

import { FichaEntrega } from '../../../models/epi';

@Component({
  selector: 'app-meus-epis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meus-epis.html',
  styleUrl: './meus-epis.scss',
})
export class MeusEpis {
  employeeEpis: EmployeeEpi[] = [];
  private readonly ids = new Map<string,number>();
  erro = "";
  selectedEpi: EmployeeEpi | null = null;
  reportState = 'Distante do vencimento';
  selectedReportImages: string[] = [];
  selectedReportFileNames: string[] = [];
  reportComment = '';
  reportSent = false;

  documents: FichaEntrega[] = [];
  carregandoFichas = true;
  erroFichas = '';
  erroDownload = '';

  constructor(private readonly epiService: EpiService) {
    this.epiService.minhasFichas().subscribe({
      next: fichas => {
        this.documents = fichas;
        this.carregandoFichas = false;
      },
      error: () => {
        this.erroFichas = 'Não foi possível carregar suas fichas.';
        this.carregandoFichas = false;
      },
    });
    this.epiService.meusEpis().subscribe({next:items=>{this.employeeEpis=items.map(e=>{const key=String(e.id);this.ids.set(key,e.id);return {ca:String(e.ca),name:e.nome,deliveredAt:'',status:e.substituido?'Substituído':'Em uso',objectKey:key};});},error:()=>{this.erro='Não foi possível carregar seus EPIs.';}});
  }

  abrirModal(epi: EmployeeEpi): void {
    this.limparImagensSelecionadas();
    this.selectedEpi = epi;
    this.reportState = 'Distante do vencimento';
    this.reportComment = '';
    this.reportSent = false;
  }

  fecharModal(): void {
    this.limparImagensSelecionadas();
    this.selectedEpi = null;
    this.reportComment = '';
    this.reportState = 'Distante do vencimento';
  }

  onReportImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.limparImagensSelecionadas();
    this.selectedReportImages = files.map((file) => URL.createObjectURL(file));
    this.selectedReportFileNames = files.map((file) => file.name);
  }

  removerImagem(index: number): void {
    const imageUrl = this.selectedReportImages[index];
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    this.selectedReportImages.splice(index, 1);
    this.selectedReportFileNames.splice(index, 1);
  }

  submitReport(): void {
    if (!this.selectedEpi) {
      return;
    }

    const selected=this.selectedEpi as EmployeeEpi & {objectKey:string};
    this.epiService.relatar(this.ids.get(selected.objectKey)!,this.reportState,this.reportComment.trim()).subscribe({next:()=>{this.fecharModal();this.reportSent=true;},error:()=>{this.erro='Não foi possível enviar o relato.';}});
  }

  baixarFicha(documento: FichaEntrega): void {
    this.erroDownload = '';
    this.epiService.baixarFicha(documento.id, documento.nome).subscribe({
      error: () => this.erroDownload = 'Não foi possível baixar a ficha.',
    });
  }
  iconeEpi(epi: EmployeeEpi): string {
    const nome = epi.name.toLowerCase();

    if (nome.includes('luva')) {
      return 'bi-hand-index-thumb';
    }

    if (nome.includes('auricular')) {
      return 'bi-headphones';
    }

    if (nome.includes('Óculos') || nome.includes('óculos')) {
      return 'bi-eyeglasses';
    }

    return 'bi-shield-check';
  }

  classeEstado(epi: EmployeeEpi): string {
    const status = epi.status.toLowerCase();

    if (status.includes('danificado') || status.includes('vencido')) {
      return 'danger';
    }

    if (status.includes('atenção') || status.includes('atencao') || status.includes('desgaste')) {
      return 'warning';
    }

    return 'good';
  }

  private readStoredReports(): Array<Record<string, unknown>> {
    try {
      const stored = localStorage.getItem('mar-employee-epi-reports');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private limparImagensSelecionadas(): void {
    this.selectedReportImages.forEach((url) => URL.revokeObjectURL(url));
    this.selectedReportImages = [];
    this.selectedReportFileNames = [];
  }

}
