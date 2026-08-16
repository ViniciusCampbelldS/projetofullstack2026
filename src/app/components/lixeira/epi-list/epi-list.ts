import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EpiService } from '../../epi/epi-status/epi-status';
import { Epi } from '../../epi/epi.models';

@Component({
	selector: 'app-epi-list',
	standalone: true,
	// CommonModule permite o uso de *ngFor e *ngIf, RouterModule permite o uso de routerLink
	imports: [CommonModule, RouterModule],
	templateUrl: './epi-list.html',
	styleUrls: ['./epi-list.scss'],
})
export class EpiList implements OnInit {
	//o array é inicializado como vazio para evitar erros de referência antes da atribuição dos dados
	epis: Epi[] = [];

	// Injeta o serviço EpiService e ChangeDetectorRef no construtor
	constructor(private epiService: EpiService, private cdr: ChangeDetectorRef) { }

	// método ngOnInit é chamado ao inicializar
	ngOnInit(): void {
		// Chama o método listar() para obter a lista de EPIs
		this.epiService.listar().subscribe({
			// atribui os dados recebidos do serviço ao array epis
			next: (epis: Epi[]) => {
				// caso epis seja um array, normalizedEpis recebe epis, senão recebe um array vazio 
				const normalizedEpis = Array.isArray(epis) ? epis : [];
				// Atribui o array normalizado à propriedade epis do componente
				this.epis = [...normalizedEpis];
				// Chama detectChanges() para garantir que a view seja atualizada com os novos dados
				this.cdr.detectChanges();
			},
			// caso ocorra algum erro na requisição, exibe o erro no console
			error: (error) => console.error('Erro ao listar os EPIs:', error),
		});
	}
	
	// Método trackById é usado para otimizar a renderização da lista de EPIs, evitando re-renderizações desnecessárias
	trackById(index: number, epi: Epi): number {
		return epi?.id ?? index;
	}
}
