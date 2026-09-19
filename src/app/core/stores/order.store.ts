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

  setSearchFilter(search: string): void {
    this.filter.update((f) => ({ ...f, search }));
  }

  setStatusFilter(status: OrderStatus | 'ALL'): void {
    this.filter.update((f) => ({ ...f, status }));
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
}
