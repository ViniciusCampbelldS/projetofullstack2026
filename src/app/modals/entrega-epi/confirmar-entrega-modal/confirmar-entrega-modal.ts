import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryItem } from '../../../components/epi/epi.models';
import { DeliveryItemsReview } from '../delivery-items-review/delivery-items-review';

@Component({
	selector: 'app-confirmar-entrega-modal',
	standalone: true,
	imports: [CommonModule, DeliveryItemsReview],
	templateUrl: './confirmar-entrega-modal.html',
	styleUrl: './confirmar-entrega-modal.scss',
})
export class ConfirmarEntregaModal {
	deliveryItems = input.required<DeliveryItem[]>();
	employeeName = input<string>('João Pedro da Rocha');
	deliveryDate = input<string>('2026-08-06');

	closed = output<void>();
	confirm = output<void>();
}
