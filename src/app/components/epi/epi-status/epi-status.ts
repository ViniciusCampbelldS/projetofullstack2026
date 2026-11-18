import { Component } from '@angular/core';
import { NotificacaoService } from '../../../services/notificacao';

@Component({
	selector: 'app-epi-status',
	standalone: true,
	templateUrl: './epi-status.html',
	styleUrls: ['./epi-status.scss'],
})
export class EpiStatus {
	get totalEpis(): number {
		return this.notificacaoService.totalEpis;
	}

	get episEmDia() {
		return this.notificacaoService.episEmDia;
	}

	get episProximos() {
		return this.notificacaoService.episProximos;
	}

	get episVencidos() {
		return this.notificacaoService.episVencidos;
	}

	constructor(private readonly notificacaoService: NotificacaoService) {}
}

