// src/app/core/stores/order.store.ts
import { Injectable, computed, signal, inject } from '@angular/core';
import { PurchaseOrder, OrderFilter, OrderStatus, OrderStats } from '../models/orders.model';
import { OrdersService } from '../services/orders.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersStore {
  private readonly ordersService = inject(OrdersService);

  // State Signals
  readonly orders = signal<PurchaseOrder[]>([]);
  readonly loading = signal<boolean>(false);
  readonly filter = signal<OrderFilter>({
    search: '',
    status: 'ALL',
  });

  // Computed Signals
  readonly filteredOrders = computed(() => {
    const currentOrders = this.orders();
    const { search, status } = this.filter();

    return currentOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'ALL' || order.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  readonly stats = computed<OrderStats>(() => {
    const currentOrders = this.orders();
    return {
      totalOrders: currentOrders.length,
      draftCount: currentOrders.filter((o) => o.status === 'draft').length,
      sentCount: currentOrders.filter((o) => o.status === 'sent').length,
      completedCount: currentOrders.filter((o) => o.status === 'completed').length,
      totalEstimatedSpend: currentOrders.reduce((acc, o) => acc + o.totalCost, 0),
    };
  });

  // Actions
  loadOrders(): void {
    this.loading.set(true);
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setFilter(newFilter: OrderFilter): void {
    this.filter.set(newFilter);
  }

  setSearchFilter(search: string): void {
    this.filter.update((f) => ({ ...f, search }));
  }

  setStatusFilter(status: OrderStatus | 'ALL'): void {
    this.filter.update((f) => ({ ...f, status }));
  }

  createOrder(orderData: Partial<PurchaseOrder>): void {
    this.loading.set(true);
    this.ordersService.createOrder(orderData).subscribe({
      next: (createdOrder) => {
        this.orders.update((list) => [createdOrder, ...list]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  updateOrder(id: string, updatedData: Partial<PurchaseOrder>): void {
    this.loading.set(true);
    this.ordersService.updateOrder(id, updatedData).subscribe({
      next: (updated) => {
        this.orders.update((list) => list.map((o) => (o.id === id ? { ...o, ...updated } : o)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  updateStatus(id: string, newStatus: OrderStatus): void {
    this.ordersService.updateOrderStatus(id, newStatus).subscribe((success) => {
      if (success) {
        this.orders.update((list) =>
          list.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
        );
      }
    });
  }

  deleteOrder(id: string): void {
    this.loading.set(true);
    this.ordersService.deleteOrder(id).subscribe({
      next: (success) => {
        if (success) {
          this.orders.update((list) => list.filter((o) => o.id !== id));
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
