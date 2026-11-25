import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventoPessoal, HistoricoService } from '../../../services/historico.service';

@Component({
  selector: 'app-meu-historico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meu-historico.html',
  styleUrl: './meu-historico.scss',
})
export class MeuHistorico implements OnInit {
  eventos: EventoPessoal[] = [];
  pagina = 0;
  tamanho = 20;
  total = 0;
  carregando = false;
  erro = '';

  constructor(private readonly historico: HistoricoService) {}
  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.historico.listarPessoal(this.pagina, this.tamanho).subscribe({
      next: (resposta) => {
        this.eventos = resposta.itens;
        this.total = resposta.total;
        this.carregando = false;
      },
      error: () => { this.erro = 'Não foi possível carregar seu histórico.'; this.carregando = false; },
    });
  }

  mudarPagina(delta: number): void {
    const nova = this.pagina + delta;
    if (this.carregando || nova < 0 || nova * this.tamanho >= this.total) return;
    this.pagina = nova;
    this.carregar();
  }

  campos(evento: EventoPessoal): string[] {
    return Object.keys({ ...evento.antes, ...evento.depois });
  }

  texto(valor: unknown): string {
    return valor == null ? '—' : Array.isArray(valor) ? valor.join(', ') : String(valor);
  }
}
