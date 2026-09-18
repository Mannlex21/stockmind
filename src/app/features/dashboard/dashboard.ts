import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryStats, Product } from '../../core/models/inventory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  // Estado reactivo con Signals
  stats = signal<InventoryStats>({
    totalProducts: 1248,
    lowStockCount: 12,
    totalValue: 45280.5,
    pendingOrders: 3,
  });

  recentProducts = signal<Product[]>([
    {
      id: '1',
      sku: 'PROD-001',
      name: 'Sensor Industrial X1',
      category: 'Electrónica',
      stock: 4,
      minStock: 10,
      unitPrice: 120.0,
      supplier: 'TechCorp',
      lastUpdated: new Date(),
      status: 'LOW_STOCK',
    },
    {
      id: '2',
      sku: 'PROD-002',
      name: 'Válvula Hidráulica 3/4',
      category: 'Mecánica',
      stock: 45,
      minStock: 15,
      unitPrice: 85.5,
      supplier: 'HydraSupplies',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
    },
    {
      id: '3',
      sku: 'PROD-003',
      name: 'Módulo de Control PLC',
      category: 'Automatización',
      stock: 0,
      minStock: 5,
      unitPrice: 450.0,
      supplier: 'AutomationLab',
      lastUpdated: new Date(),
      status: 'OUT_OF_STOCK',
    },
  ]);
}
