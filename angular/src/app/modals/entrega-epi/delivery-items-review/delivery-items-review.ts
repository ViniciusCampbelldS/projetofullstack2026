import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DeliveryItem } from '../../../components/epi/epi.models';

@Component({
  selector: 'app-delivery-items-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-items-review.html',
  styleUrl: './delivery-items-review.scss',
})
export class DeliveryItemsReview {
  deliveryItems = input.required<DeliveryItem[]>();
  employeeName = input<string>('');
  deliveryDate = input<string>('');
  showRemoveButton = input(false);

  removeItem = output<number>();
}
