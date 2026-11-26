import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoricoEvento, HistoricoService } from '../../services/historico.service';

interface Linha { eventos: HistoricoEvento[]; evento: HistoricoEvento; detalhe: string; }

@Component({
  selector: 'app-historico-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './historico-lista.html',
  styleUrl: './historico-lista.scss',
})
export class HistoricoLista implements OnInit {
  @Input() areas: string[] = [];
  linhas: Linha[] = [];
  area = '';
  pagina = 0;
  tamanho = 20;
  total = 0;
  carregando = false;
  erro = '';
  notaAbertaId: number | null = null;
  novaNota = '';

  constructor(private readonly service: HistoricoService) {}

  nomeArea(area: string): string {
    if (area === 'EPI' || area === 'NR') return area;
    if (area === 'NOTIFICACAO_EPI' || area === 'NOTIFICACAO_TREINAMENTO') return 'Dias de aviso do vencimento';
    return area.charAt(0).toLocaleUpperCase('pt-BR') + area.slice(1).toLocaleLowerCase('pt-BR').replaceAll('_', ' ');
  }

  ngOnInit(): void {
    this.area = this.areas[0] ?? '';
    this.carregar();
  }

  filtrar(): void {
    this.pagina = 0;
    this.total = 0;
    this.carregar();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total / this.tamanho));
  }

  mudarPagina(delta: number): void {
    const destino = this.pagina + delta;
    if (this.carregando || destino < 0 || destino >= this.totalPaginas) return;
    this.pagina = destino;
    this.carregar();
  }

  carregar(): void {
    if (this.carregando || !this.area) return;
    this.carregando = true;
    this.erro = '';
    this.linhas = [];
    this.notaAbertaId = null;
    this.novaNota = '';
    this.service.listar(this.area, this.pagina, this.tamanho).subscribe({
      next: ({ itens, total }) => {
        this.linhas = this.agrupar(itens);
        this.total = total;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o histórico.';
        this.carregando = false;
      },
    });
  }

  // Criações do mesmo CA, pela mesma pessoa e no mesmo minuto aparecem em uma só linha.
  private agrupar(eventos: HistoricoEvento[]): Linha[] {
    const linhas: Linha[] = [];
    const grupos = new Map<string, Linha>();
    for (const e of eventos) {
      const chave = e.acao === 'CRIACAO' && e.areaDoSite === 'EPI'
        ? `${e.autorId}|${e.depois?.['ca']}|${e.criadoEm.substring(0, 16)}` : null;
      const existente = chave ? grupos.get(chave) : undefined;
      if (existente) { existente.eventos.push(e); continue; }
      const linha: Linha = { eventos: [e], evento: e, detalhe: '' };
      if (chave) grupos.set(chave, linha);
      linhas.push(linha);
    }
    linhas.forEach((l) => l.detalhe = this.descrever(l));
    return linhas;
  }

  private descrever(l: Linha): string {
    const e = l.evento;
    if (l.eventos.length > 1) {
      return `${l.eventos.length} EPIs criados (IDs ${l.eventos.map((x) => x.registroId).reverse().join(', ')}), CA ${e.depois?.['ca']}.`;
    }
    const antes = e.antes ?? {};
    const depois = e.depois ?? {};
    const campos = Object.keys({ ...antes, ...depois });
    const partes = campos
      .filter((c) => JSON.stringify(antes[c]) !== JSON.stringify(depois[c]))
      .map((c) => e.antes ? `${c}: ${this.texto(antes[c])} → ${this.texto(depois[c])}` : `${c}: ${this.texto(depois[c])}`);
    return partes.join('; ');
  }

  private texto(valor: unknown): string {
    return valor === null || valor === undefined ? '—' : typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
  }

  classe(acao: string): string {
    return /DESCARTE|INATIV|EXCLUS/.test(acao) ? 'danger' : /CRIACAO|ENTREGA/.test(acao) ? 'success' : 'warning';
  }

  abrirNota(l: Linha): void { this.notaAbertaId = this.notaAbertaId === l.evento.id ? null : l.evento.id; this.novaNota = ''; }

  salvarNota(l: Linha): void {
    const texto = this.novaNota.trim();
    if (!texto) return;
    this.service.comentar(l.evento.id, texto).subscribe({
      next: (comentarios) => { l.evento.comentarios = comentarios; this.notaAbertaId = null; this.novaNota = ''; },
      error: () => { this.erro = 'Não foi possível salvar a nota.'; },
    });
  }
}