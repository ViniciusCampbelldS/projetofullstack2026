import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth/auth';
import { ParticipacaoTreinamento, TreinamentoService } from '../../../services/treinamento.service';

interface Turma {
  id: number;
  nrNome: string;
  data: string;
  horario: string;
  participantes: ParticipacaoTreinamento[];
  documentoNome?: string | null;
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

  documentoOcupado = false;
  documentoMensagem = '';
  documentoErro = '';
  confirmarExclusaoDocumento = false;
  presencasPendentes = new Map<string, boolean>();
  confirmandoPresencas = false;
  salvandoPresencas = false;

  constructor(private readonly service: TreinamentoService, private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.carregando = true;
    this.service.turmas().subscribe({
      next: (linhas) => {
        const mapa = new Map<number, Turma>();
        for (const l of linhas) {
          const turma = mapa.get(l.id) ?? { id: l.id, nrNome: l.nrNome, data: l.data, horario: l.horario, documentoNome: l.documentoNome, participantes: [] };
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

  selecionarTurma(id: number | null): void {
    this.turmaSelecionadaId = id;
    this.presencasPendentes.clear();
    this.confirmandoPresencas = false;
    this.limparEstadoDocumento();
  }

  private chavePresenca(participante: ParticipacaoTreinamento): string {
    return `${participante.id}:${participante.funcionarioId}`;
  }

  presencaExibida(participante: ParticipacaoTreinamento): boolean {
    return this.presencasPendentes.get(this.chavePresenca(participante)) ?? participante.presente;
  }

  get temAlteracoesPresenca(): boolean { return this.presencasPendentes.size > 0; }

  limparEstadoDocumento(): void {
    this.documentoMensagem = '';
    this.documentoErro = '';
    this.confirmarExclusaoDocumento = false;
  }

  enviarDocumento(turmaId: number, campo: HTMLInputElement): void {
    const arquivo = campo.files?.[0];
    campo.value = '';
    if (!arquivo || !this.podeEditar || this.documentoOcupado) return;
    this.limparEstadoDocumento();
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(arquivo.type) || !arquivo.size) {
      this.documentoErro = 'Selecione um arquivo PDF, PNG ou JPEG.';
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      this.documentoErro = 'O documento deve ter até 5 MB.';
      return;
    }
    this.documentoOcupado = true;
    this.service.enviarDocumento(turmaId, arquivo).subscribe({
      next: (documento) => {
        this.atualizarNomeDocumento(turmaId, documento.documentoNome);
        this.concluirDocumento('Documento salvo.');
      },
      error: (erro) => this.falhaDocumento(erro.status, 'enviar'),
    });
  }

  baixarDocumento(turmaId: number): void {
    if (this.documentoOcupado) return;
    this.limparEstadoDocumento();
    this.documentoOcupado = true;
    this.service.baixarDocumento(turmaId).subscribe({
      next: (arquivo) => {
        const extensao = arquivo.type === 'image/png' ? 'png' : arquivo.type === 'image/jpeg' ? 'jpg' : 'pdf';
        const url = URL.createObjectURL(arquivo);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.turma?.documentoNome || 'documento-turma-' + turmaId + '.' + extensao;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.concluirDocumento('Download iniciado.');
      },
      error: (erro) => this.falhaDocumento(erro.status, 'baixar'),
    });
  }

  excluirDocumento(turmaId: number): void {
    if (!this.podeEditar || !this.confirmarExclusaoDocumento || this.documentoOcupado) return;
    this.limparEstadoDocumento();
    this.documentoOcupado = true;
    this.service.excluirDocumento(turmaId).subscribe({
      next: () => {
        this.atualizarNomeDocumento(turmaId, null);
        this.concluirDocumento('Documento excluído.');
      },
      error: (erro) => this.falhaDocumento(erro.status, 'excluir'),
    });
  }

  private atualizarNomeDocumento(turmaId: number, nome: string | null): void {
    const turma = this.turmas.find((item) => item.id === turmaId);
    if (turma) turma.documentoNome = nome;
  }

  private concluirDocumento(mensagem: string): void {
    this.documentoOcupado = false;
    this.documentoMensagem = mensagem;
  }

  private falhaDocumento(status: number, acao: string): void {
    this.documentoOcupado = false;
    if (status === 404) this.documentoErro = 'Documento ou turma não encontrado.';
    else if (status === 403) this.documentoErro = 'Você não tem permissão para esta operação.';
    else if (status === 413) this.documentoErro = 'O documento deve ter até 5 MB.';
    else this.documentoErro = 'Não foi possível ' + acao + ' o documento.';
  }

  marcar(p: ParticipacaoTreinamento, presente: boolean): void {
    if (!this.podeEditar || this.salvandoPresencas) return;
    const chave = this.chavePresenca(p);
    if (presente === p.presente) this.presencasPendentes.delete(chave);
    else this.presencasPendentes.set(chave, presente);
    this.confirmandoPresencas = false;
  }

  pedirConfirmacaoPresencas(): void {
    if (this.temAlteracoesPresenca && !this.salvandoPresencas) this.confirmandoPresencas = true;
  }

  cancelarSalvarPresencas(): void { this.confirmandoPresencas = false; }

  salvarPresencas(): void {
    const turma = this.turma;
    if (!turma || !this.temAlteracoesPresenca || this.salvandoPresencas) return;
    const alteracoes = turma.participantes.flatMap((p) => {
      const presente = this.presencasPendentes.get(this.chavePresenca(p));
      return presente === undefined ? [] : [{ participante: p, presente }];
    });
    this.salvandoPresencas = true;
    forkJoin(alteracoes.map(({ participante, presente }) => this.service.atualizarPresenca(turma.id, participante.funcionarioId, presente))).subscribe({
      next: () => {
        for (const { participante, presente } of alteracoes) participante.presente = presente;
        this.presencasPendentes.clear();
        this.confirmandoPresencas = false;
        this.salvandoPresencas = false;
        this.mensagem = 'Presenças atualizadas.';
      },
      error: () => {
        this.salvandoPresencas = false;
        this.confirmandoPresencas = false;
        this.mensagem = 'Não foi possível salvar as presenças. Revise e tente novamente.';
      },
    });
  }
}
