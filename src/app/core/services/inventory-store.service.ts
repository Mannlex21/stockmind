import { Injectable, computed, signal } from '@angular/core';
import {
  InventoryStats,
  Product,
  ProductStatus,
  ReturnTransaction,
  ReturnType,
  ReturnReason,
  ProductPresentation,
} from '../models/inventory.model';
import { PurchaseOrder } from '../models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryStore {
  // --- Estados Base (Signals) ---
  readonly products = signal<Product[]>([
    {
      id: '1',
      sku: '860_EVO',
      barcodes: ['3213131313568'],
      name: 'Samsung 860 EVO Basic SSD 250GB SATA3',
      brand: 'Samsung',
      category: 'INFORMATICA',
      subcategory: 'ALMACENAMIENTO',
      isActive: true,
      useInPOS: true,
      trackStock: true,
      baseUnit: 'PCS',
      stock: 372,
      pendingToReceive: 45,
      pendingToServe: 7,
      accumulatedEntries: 395,
      accumulatedExits: 23,
      minStock: 65,
      maxStock: 260,
      costPrice: 37.02,
      costPriceWithTax: 42.94,
      unitPrice: 46.27,
      unitPriceWithTax: 55.99,
      taxRate: 21,
      supplier: 'TechCorp',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
      entryMode: 'MANUAL',
      useBatchExpiration: false,
      useSerialNumbers: true,
      stocksByWarehouse: [
        { warehouseId: 'w1', warehouseName: 'Bodega Principal', stock: 300 },
        { warehouseId: 'w2', warehouseName: 'Mostrador / Exhibición', stock: 72 },
      ],
    },
    {
      id: '2',
      sku: 'HUE-BLA-01',
      barcodes: ['7501234567890'],
      name: 'Huevo Blanco',
      brand: 'Avícola del Sur',
      category: 'ABARROTES',
      subcategory: 'LACTEOS_HUEVO',
      isActive: true,
      useInPOS: true,
      trackStock: true,
      baseUnit: 'PCS',
      stock: 720,
      pendingToReceive: 480,
      pendingToServe: 60,
      accumulatedEntries: 1200,
      accumulatedExits: 480,
      minStock: 240,
      maxStock: 2400,
      costPrice: 1.8,
      costPriceWithTax: 1.8,
      unitPrice: 2.5,
      unitPriceWithTax: 2.5,
      taxRate: 0,
      supplier: 'Avícola del Sur',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
      entryMode: 'MANUAL',
      presentations: [
        {
          id: 'p1',
          name: 'Cartera',
          baseConversionFactor: 24,
          price: 58.0,
          priceWithTax: 58.0,
          sku: 'HUE-CAR-24',
        },
        {
          id: 'p2',
          name: 'Caja',
          baseConversionFactor: 480,
          price: 1100.0,
          priceWithTax: 1100.0,
          sku: 'HUE-CAJ-20',
        },
      ],
    },
    {
      id: '3',
      sku: 'SERV-REB-01',
      name: 'Servicio de Rebanado Especial',
      category: 'SERVICIOS',
      isActive: true,
      useInPOS: true,
      trackStock: false,
      baseUnit: 'PCS',
      stock: 0,
      pendingToReceive: 0,
      pendingToServe: 0,
      minStock: 0,
      costPrice: 0,
      costPriceWithTax: 0,
      unitPrice: 15.0,
      unitPriceWithTax: 15.0,
      taxRate: 0,
      supplier: 'Interno',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
      entryMode: 'MANUAL',
    },
  ]);

  readonly purchaseOrders = signal<PurchaseOrder[]>([]);
  readonly returnLogs = signal<ReturnTransaction[]>([]);

  // Filtros del Inventario
  readonly searchQuery = signal('');
  readonly selectedStatus = signal<string>('ALL');

  // Modales
  readonly isProductModalOpen = signal(false);
  readonly activeModalTab = signal<'general' | 'prices' | 'stock' | 'presentations'>('general');
  readonly isReturnModalOpen = signal(false);

  // Selecciones temporales
  readonly editingProduct = signal<Partial<Product> | null>(null);
  readonly selectedProductForReturn = signal<Product | null>(null);

  // --- Señales Computadas (Computed) ---
  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.products().filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query);

      const matchesStatus = status === 'ALL' || product.status === status;
      return matchesSearch && matchesStatus;
    });
  });

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

  // --- Operaciones CRUD e interacciones de Modales ---
  openProductModal(product?: Product): void {
    this.activeModalTab.set('general');
    if (product) {
      this.editingProduct.set(JSON.parse(JSON.stringify(product)));
    } else {
      this.editingProduct.set({
        sku: '',
        barcodes: [''],
        name: '',
        brand: '',
        category: '',
        subcategory: '',
        isActive: true,
        useInPOS: true,
        trackStock: true,
        baseUnit: 'PCS',
        stock: 0,
        pendingToReceive: 0,
        pendingToServe: 0,
        accumulatedEntries: 0,
        accumulatedExits: 0,
        minStock: 10,
        maxStock: 100,
        costPrice: 0,
        costPriceWithTax: 0,
        unitPrice: 0,
        unitPriceWithTax: 0,
        taxRate: 16,
        supplier: '',
        useBatchExpiration: false,
        useSerialNumbers: false,
        presentations: [],
        stocksByWarehouse: [
          { warehouseId: 'w1', warehouseName: 'Bodega Principal', stock: 0 },
          { warehouseId: 'w2', warehouseName: 'Mostrador / Vitrina', stock: 0 },
        ],
        entryMode: 'MANUAL',
      });
    }
    this.isProductModalOpen.set(true);
  }

  closeProductModal(): void {
    this.isProductModalOpen.set(false);
    this.editingProduct.set(null);
  }

  saveProduct(): void {
    const current = this.editingProduct();
    if (!current) return;

    let calculatedTotalStock = current.stock || 0;
    if (current.trackStock) {
      if (current.stocksByWarehouse && current.stocksByWarehouse.length > 0) {
        calculatedTotalStock = current.stocksByWarehouse.reduce(
          (acc, w) => acc + (Number(w.stock) || 0),
          0,
        );
      }
    } else {
      calculatedTotalStock = 0;
    }

    const status = this.calculateProductStatus(
      calculatedTotalStock,
      current.minStock || 0,
      current.trackStock ?? true,
    );

    if (current.id) {
      this.products.update((list) =>
        list.map((p) =>
          p.id === current.id
            ? ({
                ...p,
                ...current,
                stock: calculatedTotalStock,
                status,
                lastUpdated: new Date(),
              } as Product)
            : p,
        ),
      );
    } else {
      const newProduct: Product = {
        ...(current as Product),
        id: crypto.randomUUID(),
        stock: calculatedTotalStock,
        status,
        lastUpdated: new Date(),
      };
      this.products.update((list) => [newProduct, ...list]);
    }

    this.closeProductModal();
  }

  deleteProduct(id: string): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }

  openReturnModal(product: Product): void {
    this.selectedProductForReturn.set(product);
    this.isReturnModalOpen.set(true);
  }

  closeReturnModal(): void {
    this.isReturnModalOpen.set(false);
    this.selectedProductForReturn.set(null);
  }

  processReturn(data: {
    type: ReturnType;
    reason: ReturnReason;
    quantity: number;
    presentationId: string;
    restockInventory: boolean;
    notes: string;
  }): void {
    const product = this.selectedProductForReturn();
    if (!product) return;

    let factor = 1;
    let presName: string = product.baseUnit;
    let unitPrice = product.unitPriceWithTax || product.unitPrice;

    if (data.presentationId) {
      const pres = product.presentations?.find((p) => p.id === data.presentationId);
      if (pres) {
        factor = pres.baseConversionFactor;
        presName = pres.name;
        unitPrice = pres.priceWithTax || pres.price;
      }
    }

    const baseQuantity = data.quantity * factor;
    const totalAmount = data.quantity * unitPrice;
    const isCustomerReturn = data.type === 'CUSTOMER_RETURN';

    const returnRecord: ReturnTransaction = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      type: data.type,
      reason: data.reason,
      presentationId: data.presentationId || undefined,
      quantityReturned: data.quantity,
      baseQuantity: baseQuantity,
      restockInventory: data.restockInventory,
      totalAmount: totalAmount,
      date: new Date(),
      notes: `${data.quantity} ${presName} - ${data.notes}`,
      entryMode: 'MANUAL',
    };

    if (product.trackStock) {
      this.products.update((list) =>
        list.map((p) => {
          if (p.id !== product.id) return p;

          let newStock = p.stock;
          let accExits = p.accumulatedExits || 0;
          let accEntries = p.accumulatedEntries || 0;

          if (isCustomerReturn) {
            if (data.restockInventory) {
              newStock += baseQuantity;
              accEntries += baseQuantity;
            }
          } else {
            newStock = Math.max(0, newStock - baseQuantity);
            accExits += baseQuantity;
          }

          const status = this.calculateProductStatus(newStock, p.minStock, p.trackStock);

          return {
            ...p,
            stock: newStock,
            accumulatedEntries: accEntries,
            accumulatedExits: accExits,
            status,
            lastUpdated: new Date(),
          };
        }),
      );
    }

    this.returnLogs.update((logs) => [returnRecord, ...logs]);
    this.closeReturnModal();
  }

  // --- Auxiliares de Cálculo para Formulario del Modal ---
  onUnitPriceChange(val: number): void {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const priceWithTax = Number((val * (1 + taxRate / 100)).toFixed(4));
    this.editingProduct.set({ ...current, unitPrice: val, unitPriceWithTax: priceWithTax });
  }

  onUnitPriceWithTaxChange(val: number): void {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const unitPrice = taxRate > 0 ? Number((val / (1 + taxRate / 100)).toFixed(4)) : val;
    this.editingProduct.set({ ...current, unitPrice, unitPriceWithTax: val });
  }

  onCostPriceChange(val: number): void {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const costPriceWithTax = Number((val * (1 + taxRate / 100)).toFixed(4));
    this.editingProduct.set({ ...current, costPrice: val, costPriceWithTax });
  }

  onTaxRateChange(val: number): void {
    const current = this.editingProduct();
    if (!current) return;
    const unitPrice = current.unitPrice || 0;
    const costPrice = current.costPrice || 0;
    this.editingProduct.set({
      ...current,
      taxRate: val,
      unitPriceWithTax: Number((unitPrice * (1 + val / 100)).toFixed(4)),
      costPriceWithTax: Number((costPrice * (1 + val / 100)).toFixed(4)),
    });
  }

  addPresentation(): void {
    const current = this.editingProduct();
    if (!current) return;

    const newPres: ProductPresentation = {
      id: crypto.randomUUID(),
      name: '',
      baseConversionFactor: 1,
      price: 0,
      priceWithTax: 0,
    };

    const presentations = current.presentations ? [...current.presentations, newPres] : [newPres];
    this.editingProduct.set({ ...current, presentations });
  }

  removePresentation(index: number): void {
    const current = this.editingProduct();
    if (!current || !current.presentations) return;

    const presentations = current.presentations.filter((_, i) => i !== index);
    this.editingProduct.set({ ...current, presentations });
  }

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
}
