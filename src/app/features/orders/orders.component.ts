import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersStore } from '../../core/stores/order.store';
import { OrderStatus } from '../../core/models/orders.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  readonly store = inject(OrdersStore);

  ngOnInit(): void {
    this.store.loadOrders();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearchFilter(value);
  }

  onStatusChange(status: string): void {
    this.store.setStatusFilter(status as OrderStatus | 'ALL');
  }

  getStatusBadgeClass(status: OrderStatus): string {
    switch (status) {
      case 'completed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'sent':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'draft':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'cancelled':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  }
}
