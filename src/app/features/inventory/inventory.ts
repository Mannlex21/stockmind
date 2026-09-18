import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Product,
  ProductPresentation,
  ReturnTransaction,
  WarehouseStock,
  ReturnType,
  ReturnReason,
} from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
})
export class Inventory {
  // Filtros
  searchQuery = signal('');
  selectedStatus = signal<string>('ALL');

  // Modales y Pestaña Activa del Modal
  isProductModalOpen = signal(false);
  activeModalTab = signal<'general' | 'prices' | 'stock' | 'presentations'>('general');
  isReturnModalOpen = signal(false);

  // Edición de Producto
  editingProduct = signal<Partial<Product> | null>(null);

  // Estado para Registrar Devolución
  selectedProductForReturn = signal<Product | null>(null);
  returnType = signal<ReturnType>('CUSTOMER_RETURN');
  returnReason = signal<ReturnReason>('DAMAGED');
  returnQuantity = signal<number>(1);
  returnPresentationId = signal<string>('');
  restockInventory = signal<boolean>(false);
  returnNotes = signal<string>('');

  // Historial de Devoluciones
  returnLogs = signal<ReturnTransaction[]>([]);

  // Productos Mock
  products = signal<Product[]>([
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

  // Filtrado reactivo de productos
  filteredProducts = computed(() => {
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

  // Cálculo de Precios con/sin IVA en Modal
  onUnitPriceChange(val: number) {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const priceWithTax = Number((val * (1 + taxRate / 100)).toFixed(4));
    this.editingProduct.set({ ...current, unitPrice: val, unitPriceWithTax: priceWithTax });
  }

  onUnitPriceWithTaxChange(val: number) {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const unitPrice = taxRate > 0 ? Number((val / (1 + taxRate / 100)).toFixed(4)) : val;
    this.editingProduct.set({ ...current, unitPrice, unitPriceWithTax: val });
  }

  onCostPriceChange(val: number) {
    const current = this.editingProduct();
    if (!current) return;
    const taxRate = current.taxRate || 0;
    const costPriceWithTax = Number((val * (1 + taxRate / 100)).toFixed(4));
    this.editingProduct.set({ ...current, costPrice: val, costPriceWithTax });
  }

  onTaxRateChange(val: number) {
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

  // --- LÓGICA CRUD ---
  openProductModal(product?: Product) {
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

  closeProductModal() {
    this.isProductModalOpen.set(false);
    this.editingProduct.set(null);
  }

  addPresentation() {
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

  removePresentation(index: number) {
    const current = this.editingProduct();
    if (!current || !current.presentations) return;

    const presentations = current.presentations.filter((_, i) => i !== index);
    this.editingProduct.set({ ...current, presentations });
  }

  saveProduct(): void {
    const current = this.editingProduct();
    if (!current) return;

    // 1. Recalcular el stock total acumulando las existencias de cada almacén (Lectura)
    let calculatedTotalStock = current.stock || 0;

    if (current.trackStock) {
      if (current.stocksByWarehouse && current.stocksByWarehouse.length > 0) {
        calculatedTotalStock = current.stocksByWarehouse.reduce(
          (acc, w) => acc + (Number(w.stock) || 0),
          0,
        );
      }
    } else {
      // Si no gestiona inventario (ej. Servicios), el stock es 0
      calculatedTotalStock = 0;
    }

    // 2. Determinar el estado del stock según el umbral mínimo
    let calculatedStatus: Product['status'] = 'IN_STOCK';
    if (calculatedTotalStock === 0) {
      calculatedStatus = 'OUT_OF_STOCK';
    } else if (calculatedTotalStock <= (current.minStock || 0)) {
      calculatedStatus = 'LOW_STOCK';
    }

    // 3. Objeto final preparado para enviar a la API / Backend
    const updatedProduct: Partial<Product> = {
      ...current,
      stock: calculatedTotalStock,
      status: calculatedStatus,
      lastUpdated: new Date().toISOString(),
    };

    console.log('Producto guardado exitosamente:', updatedProduct);
    // Aquí invocas tu servicio de backend: this.inventoryService.update(updatedProduct)...

    this.closeModal();
  }
  closeModal(): void {
    this.editingProduct.set(null);
  }
  deleteProduct(id: string) {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }

  // --- LÓGICA DE DEVOLUCIONES Y MERMAS ---
  openReturnModal(product: Product) {
    this.selectedProductForReturn.set(product);
    this.returnType.set('CUSTOMER_RETURN');
    this.returnReason.set('DAMAGED');
    this.returnQuantity.set(1);
    this.returnPresentationId.set('');
    this.restockInventory.set(false);
    this.returnNotes.set('');
    this.isReturnModalOpen.set(true);
  }

  closeReturnModal() {
    this.isReturnModalOpen.set(false);
    this.selectedProductForReturn.set(null);
  }

  processReturn() {
    const product = this.selectedProductForReturn();
    if (!product) return;

    const qty = this.returnQuantity();
    const presId = this.returnPresentationId();

    let factor = 1;
    let presName: string = product.baseUnit;
    let unitPrice = product.unitPriceWithTax || product.unitPrice;

    if (presId) {
      const pres = product.presentations?.find((p) => p.id === presId);
      if (pres) {
        factor = pres.baseConversionFactor;
        presName = pres.name;
        unitPrice = pres.priceWithTax || pres.price;
      }
    }

    const baseQuantity = qty * factor;
    const totalAmount = qty * unitPrice;
    const isCustomerReturn = this.returnType() === 'CUSTOMER_RETURN';
    const shouldRestock = this.restockInventory();

    const returnRecord: ReturnTransaction = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      type: this.returnType(),
      reason: this.returnReason(),
      presentationId: presId || undefined,
      quantityReturned: qty,
      baseQuantity: baseQuantity,
      restockInventory: shouldRestock,
      totalAmount: totalAmount,
      date: new Date(),
      notes: `${qty} ${presName} - ${this.returnNotes()}`,
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
            if (shouldRestock) {
              newStock += baseQuantity;
              accEntries += baseQuantity;
            }
          } else {
            newStock = Math.max(0, newStock - baseQuantity);
            accExits += baseQuantity;
          }

          const calculatedStatus =
            newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= p.minStock ? 'LOW_STOCK' : 'IN_STOCK';

          return {
            ...p,
            stock: newStock,
            accumulatedEntries: accEntries,
            accumulatedExits: accExits,
            status: calculatedStatus,
            lastUpdated: new Date(),
          };
        }),
      );
    }

    this.returnLogs.update((logs) => [returnRecord, ...logs]);
    this.closeReturnModal();
  }
}
