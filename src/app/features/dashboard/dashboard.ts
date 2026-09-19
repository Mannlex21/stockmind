import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryStats, Product } from '../../core/models/inventory.model';
import { PurchaseOrder } from '../../core/models/orders.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  /** Métricas e indicadores clave de rendimiento (KPIs) */
  readonly stats = signal<InventoryStats>({
    totalProducts: 148,
    lowStockCount: 5,
    totalValue: 248500.5,
    pendingOrders: 3,
  });

  /** Lista de productos con bajo stock para atención rápida */
  readonly lowStockProducts = signal<Product[]>([
    {
      id: 'prod-001',
      sku: 'ACE-500ML',
      name: 'Aceite de Oliva Extra Virgen 500ml',
      category: 'Abarrotes',
      isActive: true,
      useInPOS: true,
      trackStock: true,
      baseUnit: 'ML',
      stock: 3,
      minStock: 10,
      pendingToReceive: 20,
      pendingToServe: 0,
      costPrice: 85.0,
      unitPrice: 120.0,
      unitPriceWithTax: 139.2,
      taxRate: 16,
      supplier: 'Distribuidora del Valle',
      lastUpdated: '2026-09-15',
      status: 'LOW_STOCK',
    },
    {
      id: 'prod-002',
      sku: 'HAR-1KG',
      name: 'Harina de Trigo Integral 1kg',
      category: 'Insumos',
      isActive: true,
      useInPOS: false,
      trackStock: true,
      baseUnit: 'KG',
      stock: 1,
      minStock: 15,
      pendingToReceive: 50,
      pendingToServe: 5,
      costPrice: 18.5,
      unitPrice: 28.0,
      unitPriceWithTax: 28.0,
      taxRate: 0,
      supplier: 'Molinos del Norte',
      lastUpdated: '2026-09-16',
      status: 'LOW_STOCK',
    },
  ]);

  /** Órdenes de compra pendientes recientes */
  readonly recentOrders = signal<PurchaseOrder[]>([
    {
      id: 'PO-2026-001',
      date: '2026-09-14',
      status: 'sent',
      totalCost: 12400.0,
      supplier: '',
      orderNumber: '1',
      items: [
        {
          productId: 'prod-001',
          productName: 'Aceite de Oliva Extra Virgen 500ml',
          quantityToOrder: 20,
          estimatedCost: 85.0,
          supplier: 'Distribuidora del Valle',
        },
      ],
    },
    {
      id: 'PO-2026-002',
      date: '2026-09-16',
      status: 'draft',
      totalCost: 3500.0,
      supplier: '',
      orderNumber: '1',
      items: [],
    },
  ]);

  ngOnInit(): void {
    // Aquí puedes invocar el servicio para cargar los datos reales del backend
  }
}
