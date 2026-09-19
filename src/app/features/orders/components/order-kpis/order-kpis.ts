import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStats } from '../../../../core/models/orders.model';

@Component({
  selector: 'app-order-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-kpis.html',
})
export class OrderKpisComponent {
  stats = input.required<OrderStats>();
}
