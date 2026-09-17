import { Injectable, computed, signal } from '@angular/core';
import { Product, PurchaseOrder } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryStore {
  // --- Estados Base (Signals) ---
  readonly products = signal<Product[]>([
    {
      id: '1',
      sku: 'SKU-001',
      name: 'Sensor Industrial Proximity X1',
      category: 'Electrónica',
      stock: 3,
      minStock: 10,
      unitPrice: 45.0,
      supplier: 'TechSupplies Inc.',
      lastUpdated: new Date(),
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: 'Cable Flex M8 Dual 5m',
      category: 'Cableado',
      stock: 45,
      minStock: 15,
      unitPrice: 12.5,
      supplier: 'KableCorp',
      lastUpdated: new Date(),
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: 'Modulo Relé 8 Canales 24V',
      category: 'Automatización',
      stock: 2,
      minStock: 8,
      unitPrice: 28.0,
      supplier: 'TechSupplies Inc.',
      lastUpdated: new Date(),
    },
  ]);

  readonly purchaseOrders = signal<PurchaseOrder[]>([]);

  // --- Señales Computadas (Computed) ---
  readonly totalInventoryValue = computed(() => {
    return this.products().reduce((total, p) => total + p.stock * p.unitPrice, 0);
  });

  readonly lowStockProducts = computed(() => {
    return this.products().filter((p) => p.stock <= p.minStock);
  });

  // --- Acciones de Estado ---
  addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): void {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
    };
    this.products.update((items) => [...items, newProduct]);
  }

  updateStock(productId: string, newStock: number): void {
    this.products.update((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, stock: newStock, lastUpdated: new Date() } : item,
      ),
    );
  }

  addProductsFromInvoice(extractedItems: Omit<Product, 'id' | 'lastUpdated'>[]): void {
    extractedItems.forEach((newItem) => {
      const existingProduct = this.products().find((p) => p.sku === newItem.sku);

      if (existingProduct) {
        this.updateStock(existingProduct.id, existingProduct.stock + newItem.stock);
      } else {
        this.addProduct(newItem);
      }
    });
  }

  addPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'date'>): void {
    const newOrder: PurchaseOrder = {
      ...order,
      id: `PO-${Date.now().toString().slice(-4)}`,
      date: new Date(),
    };
    this.purchaseOrders.update((orders) => [newOrder, ...orders]);
  }
}
