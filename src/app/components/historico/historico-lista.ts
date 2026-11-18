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
})
export class HistoricoLista implements OnInit {
  @Input() areas: string[] = [];
  linhas: Linha[] = [];
  carregando = false;
  erro = '';
  notaAbertaId: number | null = null;
  novaNota = '';

  constructor(private readonly service: HistoricoService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.service.listar(this.areas).subscribe({
      next: (eventos) => { this.linhas = this.agrupar(eventos); this.carregando = false; },
      error: () => { this.erro = 'Não foi possível carregar o histórico.'; this.carregando = false; },
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