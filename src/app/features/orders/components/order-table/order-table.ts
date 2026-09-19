import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, OrderStatus } from '../../../../core/models/orders.model';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-table.html',
})
export class OrderTableComponent {
  orders = input.required<PurchaseOrder[]>();

  editOrder = output<PurchaseOrder>();
  deleteOrder = output<string>();
  statusChange = output<{ id: string; status: OrderStatus }>();

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'sent':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'draft':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    return '';
  }
}
