import { Injectable, computed, signal } from '@angular/core';
import {
  DataEntryMode,
  InventoryStats,
  Product,
  ProductStatus,
  PurchaseOrder,
} from '../models/inventory.model';

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
      isActive: true,
      useInPOS: true,
      trackStock: true,
      baseUnit: 'PCS',
      stock: 3,
      minStock: 10,
      pendingToReceive: 15,
      pendingToServe: 0,
      costPrice: 32.0,
      unitPrice: 45.0,
      unitPriceWithTax: 52.2,
      taxRate: 16,
      supplier: 'TechSupplies Inc.',
      lastUpdated: new Date(),
      status: 'LOW_STOCK',
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: 'Cable Flex M8 Dual 5m',
      category: 'Cableado',
      isActive: true,
      useInPOS: true,
      trackStock: true,
      baseUnit: 'PCS',
      stock: 45,
      minStock: 15,
      pendingToReceive: 0,
      pendingToServe: 2,
      costPrice: 8.5,
      unitPrice: 12.5,
      unitPriceWithTax: 14.5,
      taxRate: 16,
      supplier: 'KableCorp',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: 'Modulo Relé 8 Canales 24V',
      category: 'Automatización',
      isActive: true,
      useInPOS: false,
      trackStock: true,
      baseUnit: 'PCS',
      stock: 0,
      minStock: 8,
      pendingToReceive: 10,
      pendingToServe: 0,
      costPrice: 20.0,
      unitPrice: 28.0,
      unitPriceWithTax: 32.48,
      taxRate: 16,
      supplier: 'TechSupplies Inc.',
      lastUpdated: new Date(),
      status: 'OUT_OF_STOCK',
    },
  ]);

  readonly purchaseOrders = signal<PurchaseOrder[]>([]);

  // --- Señales Computadas (Computed) ---
  readonly lowStockProducts = computed(() => {
    return this.products().filter(
      (p) =>
        p.trackStock &&
        (p.stock <= p.minStock || p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK'),
    );
  });

  readonly totalInventoryValue = computed(() => {
    return this.products().reduce((total, p) => total + p.stock * p.costPrice, 0);
  });

  readonly stats = computed<InventoryStats>(() => {
    const allProducts = this.products();
    const orders = this.purchaseOrders();

    return {
      totalProducts: allProducts.length,
      lowStockCount: this.lowStockProducts().length,
      totalValue: this.totalInventoryValue(),
      pendingOrders: orders.filter((o) => o.status === 'draft' || o.status === 'sent').length,
    };
  });

  // --- Métodos Auxiliares ---
  private calculateProductStatus(
    stock: number,
    minStock: number,
    trackStock: boolean,
  ): ProductStatus {
    if (!trackStock) return 'IN_STOCK';
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  // --- Acciones de Estado ---
  addProduct(
    product: Omit<Product, 'id' | 'lastUpdated' | 'status'> & { status?: ProductStatus },
  ): void {
    const calculatedStatus = this.calculateProductStatus(
      product.stock,
      product.minStock,
      product.trackStock,
    );

    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
      status: product.status || calculatedStatus,
    };

    this.products.update((items) => [...items, newProduct]);
  }

  updateStock(productId: string, newStock: number): void {
    this.products.update((items) =>
      items.map((item) => {
        if (item.id === productId) {
          const updatedStatus = this.calculateProductStatus(
            newStock,
            item.minStock,
            item.trackStock,
          );
          return {
            ...item,
            stock: newStock,
            status: updatedStatus,
            lastUpdated: new Date(),
          };
        }
        return item;
      }),
    );
  }

  addProductsFromInvoice(
    extractedItems: (Omit<Product, 'id' | 'lastUpdated' | 'status'> & {
      entryMode?: DataEntryMode;
    })[],
  ): void {
    extractedItems.forEach((newItem) => {
      const existingProduct = this.products().find((p) => p.sku === newItem.sku);

      if (existingProduct) {
        this.updateStock(existingProduct.id, existingProduct.stock + newItem.stock);
      } else {
        this.addProduct({
          ...newItem,
          entryMode: newItem.entryMode || 'AI_GENERATED',
        });
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
