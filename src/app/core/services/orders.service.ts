import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OrderStatus, PurchaseOrder } from '../models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/orders'; // Endpoint preparado para ASP.NET Core Web API

  // Mock data para desarrollo local
  private mockOrders: PurchaseOrder[] = [
    {
      id: 'po-101',
      orderNumber: 'OC-2026-001',
      date: '2026-09-15',
      supplier: 'Lácteos del Norte S.A.',
      status: 'sent',
      totalCost: 18450.0,
      entryMode: 'MANUAL',
      items: [
        {
          productId: 'prod-1',
          productName: 'Queso Crema 1kg',
          quantityToOrder: 50,
          estimatedCost: 120.0,
          supplier: 'Lácteos del Norte S.A.',
        },
        {
          productId: 'prod-2',
          productName: 'Leche Entera Caja 12U',
          quantityToOrder: 30,
          estimatedCost: 415.0,
          supplier: 'Lácteos del Norte S.A.',
        },
      ],
    },
    {
      id: 'po-102',
      orderNumber: 'OC-2026-002',
      date: '2026-09-17',
      supplier: 'Distribuidora Abarrotera Central',
      status: 'draft',
      totalCost: 8900.5,
      entryMode: 'AI_GENERATED',
      items: [
        {
          productId: 'prod-5',
          productName: 'Aceite Vegetal 1L',
          quantityToOrder: 100,
          estimatedCost: 38.5,
          supplier: 'Distribuidora Abarrotera Central',
        },
      ],
    },
  ];

  getOrders(): Observable<PurchaseOrder[]> {
    return of(this.mockOrders);
  }

  createOrder(order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      orderNumber: `OC-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      supplier: order.supplier || 'Proveedor General',
      status: order.status || 'draft',
      totalCost: order.totalCost || 0,
      items: order.items || [],
      entryMode: order.entryMode || 'MANUAL',
    };
    this.mockOrders.unshift(newOrder);
    return of(newOrder);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<boolean> {
    const order = this.mockOrders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      return of(true);
    }
    return of(false);
  }
}
