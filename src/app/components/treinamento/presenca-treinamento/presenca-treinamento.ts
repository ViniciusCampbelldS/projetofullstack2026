import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { ParticipacaoTreinamento, TreinamentoService } from '../../../services/treinamento.service';

interface Turma {
  id: number;
  nrNome: string;
  data: string;
  horario: string;
  participantes: ParticipacaoTreinamento[];
}

@Component({
  selector: 'app-abre-treinamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presenca-treinamento.html',
  styleUrl: './presenca-treinamento.scss'
})
export class PresencaTreinamento implements OnInit {
  turmas: Turma[] = [];
  turmaSelecionadaId: number | null = null;
  carregando = false;
  mensagem = '';

  constructor(private readonly service: TreinamentoService, private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.carregando = true;
    this.service.turmas().subscribe({
      next: (linhas) => {
        const mapa = new Map<number, Turma>();
        for (const l of linhas) {
          const turma = mapa.get(l.id) ?? { id: l.id, nrNome: l.nrNome, data: l.data, horario: l.horario, participantes: [] };
          if (l.funcionarioId) turma.participantes.push(l);
          mapa.set(l.id, turma);
        }
        this.turmas = [...mapa.values()].sort((a, b) => b.data.localeCompare(a.data));
        this.turmaSelecionadaId = this.turmas[0]?.id ?? null;
        this.carregando = false;
      },
      error: () => { this.mensagem = 'Não foi possível carregar as turmas.'; this.carregando = false; },
    });
  }

  get podeEditar(): boolean { return this.auth.podeEditarTreinamento(); }

  get turma(): Turma | null { return this.turmas.find((t) => t.id === this.turmaSelecionadaId) ?? null; }

  marcar(p: ParticipacaoTreinamento, presente: boolean): void {
    this.service.atualizarPresenca(p.id, p.funcionarioId, presente).subscribe({
      next: () => { p.presente = presente; this.mensagem = ''; },
      error: () => { this.mensagem = 'Não foi possível salvar a presença.'; },
    });
  }
}