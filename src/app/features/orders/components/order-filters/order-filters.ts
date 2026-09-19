import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderFilter, OrderStatus } from '../../../../core/models/orders.model';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-filters.html',
})
export class OrderFiltersComponent {
  filter = input.required<OrderFilter>();
  filterChange = output<OrderFilter>();

  readonly statusOptions: { label: string; value: OrderStatus | 'ALL' }[] = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Borrador', value: 'draft' },
    { label: 'Enviada', value: 'sent' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' },
  ];

  onSearchChange(search: string): void {
    this.filterChange.emit({ ...this.filter(), search });
  }

  onStatusChange(status: any): void {
    this.filterChange.emit({ ...this.filter(), status });
  }
}
