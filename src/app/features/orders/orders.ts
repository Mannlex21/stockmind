// src/app/features/orders/orders.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrder, OrderFilter } from '../../core/models/orders.model';
import { OrdersStore } from '../../core/stores/order.store';

// Verifica que la extensión y nombre de archivo coincidan con la estructura de tu proyecto
import { OrderKpisComponent } from './components/order-kpis/order-kpis';
import { OrderFiltersComponent } from './components/order-filters/order-filters';
import { OrderTableComponent } from './components/order-table/order-table';
import { OrderFormModalComponent } from './components/order-form-modal/order-form-modal';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    OrderKpisComponent,
    OrderFiltersComponent,
    OrderTableComponent,
    OrderFormModalComponent,
  ],
  templateUrl: './orders.html',
})
export class OrdersComponent implements OnInit {
  readonly store = inject(OrdersStore);

  isModalOpen = signal<boolean>(false);
  selectedOrder = signal<PurchaseOrder | null>(null);

  ngOnInit(): void {
    this.store.loadOrders();
  }

  openCreateModal(): void {
    this.selectedOrder.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(order: PurchaseOrder): void {
    this.selectedOrder.set(order);
    this.isModalOpen.set(true);
  }

  handleFilterChange(filter: OrderFilter): void {
    this.store.setFilter(filter);
  }

  handleSaveOrder(data: Partial<PurchaseOrder>): void {
    const current = this.selectedOrder();
    if (current) {
      this.store.updateOrder(current.id, data);
    } else {
      this.store.createOrder(data);
    }
  }

  handleDeleteOrder(id: string): void {
    this.store.deleteOrder(id);
  }
}
