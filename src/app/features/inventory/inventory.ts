import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Product,
  ProductPresentation,
  ReturnTransaction,
  UnitOfMeasure,
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

  // Modales
  isProductModalOpen = signal(false);
  isReturnModalOpen = signal(false);

  // Edición de Producto
  editingProduct = signal<Partial<Product> | null>(null);

  // Estado para Registrar Devolución
  selectedProductForReturn = signal<Product | null>(null);
  returnType = signal<ReturnType>('CUSTOMER_RETURN');
  returnReason = signal<ReturnReason>('DAMAGED');
  returnQuantity = signal<number>(1);
  returnPresentationId = signal<string>(''); // Vacio = Unidad Base
  restockInventory = signal<boolean>(false); // False por defecto si está dañado
  returnNotes = signal<string>('');

  // Historial de Devoluciones (Mock Data)
  returnLogs = signal<ReturnTransaction[]>([]);

  // Productos de prueba adaptados a la Cremería
  products = signal<Product[]>([
    {
      id: '1',
      sku: 'HUE-BLA-01',
      name: 'Huevo Blanco',
      category: 'Abarrotes / Lácteos',
      baseUnit: 'PCS',
      stock: 720, // 720 piezas totales
      minStock: 240,
      unitPrice: 2.5, // Precio por pieza individual
      supplier: 'Avícola del Sur',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
      entryMode: 'MANUAL',
      presentations: [
        { id: 'p1', name: 'Cartera', baseConversionFactor: 24, price: 58.0, sku: 'HUE-CAR-24' },
        {
          id: 'p2',
          name: 'Caja',
          parentPresentationId: 'p1',
          baseConversionFactor: 480,
          price: 1100.0,
          sku: 'HUE-CAJ-20',
        },
      ],
    },
    {
      id: '2',
      sku: 'CRE-GRA-01',
      name: 'Crema de Rancho (Granel)',
      category: 'Lácteos',
      baseUnit: 'KG',
      stock: 18.5, // 18.5 Kilos
      minStock: 5.0,
      unitPrice: 75.0, // Precio por Kg
      supplier: 'Lácteos Tuxpan',
      lastUpdated: new Date(),
      status: 'IN_STOCK',
      entryMode: 'AI_GENERATED',
      presentations: [
        { id: 'p3', name: 'Medio Kilo (500g)', baseConversionFactor: 0.5, price: 40.0 },
        { id: 'p4', name: 'Bote 1 Kg', baseConversionFactor: 1.0, price: 75.0 },
      ],
    },
    {
      id: '3',
      sku: 'CHI-LAT-01',
      name: 'Chiles Jalapeños en Lata',
      category: 'Enlatados',
      baseUnit: 'PCS',
      stock: 2,
      minStock: 10,
      unitPrice: 120.0,
      supplier: 'La Costeña',
      lastUpdated: new Date(),
      status: 'LOW_STOCK',
      entryMode: 'AI_EDITED',
      presentations: [
        { id: 'p5', name: 'Caja (12 Latas)', baseConversionFactor: 12, price: 1350.0 },
      ],
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
        product.category.toLowerCase().includes(query);

      const matchesStatus = status === 'ALL' || product.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  // --- LÓGICA DE PRODUCTO (CRUD) ---
  openProductModal(product?: Product) {
    if (product) {
      // Clonado profundo para evitar mutaciones directas
      this.editingProduct.set(JSON.parse(JSON.stringify(product)));
    } else {
      this.editingProduct.set({
        sku: '',
        name: '',
        category: '',
        baseUnit: 'PCS',
        stock: 0,
        minStock: 10,
        unitPrice: 0,
        supplier: '',
        presentations: [],
        entryMode: 'MANUAL',
      });
    }
    this.isProductModalOpen.set(true);
  }

  closeProductModal() {
    this.isProductModalOpen.set(false);
    this.editingProduct.set(null);
  }

  // Agregar presentación al producto en edición
  addPresentation() {
    const current = this.editingProduct();
    if (!current) return;

    const newPres: ProductPresentation = {
      id: crypto.randomUUID(),
      name: '',
      baseConversionFactor: 1,
      price: 0,
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

  saveProduct() {
    const current = this.editingProduct();
    if (!current || !current.name || !current.sku) return;

    const calculatedStatus =
      (current.stock || 0) <= 0
        ? 'OUT_OF_STOCK'
        : (current.stock || 0) <= (current.minStock || 0)
          ? 'LOW_STOCK'
          : 'IN_STOCK';

    if (current.id) {
      // UPDATE
      this.products.update((list) =>
        list.map((p) =>
          p.id === current.id
            ? ({ ...p, ...current, status: calculatedStatus, lastUpdated: new Date() } as Product)
            : p,
        ),
      );
    } else {
      // CREATE
      const newProduct: Product = {
        ...current,
        id: crypto.randomUUID(),
        lastUpdated: new Date(),
        status: calculatedStatus,
        entryMode: 'MANUAL',
      } as Product;

      this.products.update((list) => [newProduct, ...list]);
    }

    this.closeProductModal();
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
    this.selectedProductForReturn.set(null); // <-- Corregido: .set(null)
  }

  processReturn() {
    const product = this.selectedProductForReturn();
    if (!product) return;

    const qty = this.returnQuantity();
    const presId = this.returnPresentationId();

    let factor = 1;
    // Tipamos presName explícitamente como string para permitir nombres de presentaciones
    let presName: string = product.baseUnit;
    let unitPrice = product.unitPrice;

    if (presId) {
      const pres = product.presentations?.find((p) => p.id === presId);
      if (pres) {
        factor = pres.baseConversionFactor;
        presName = pres.name; // <-- Corregido: Ahora string permite asignar "Cartera", "Caja", etc.
        unitPrice = pres.price;
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

    this.products.update((list) =>
      list.map((p) => {
        if (p.id !== product.id) return p;

        let newStock = p.stock;

        if (isCustomerReturn) {
          if (shouldRestock) newStock += baseQuantity;
        } else {
          newStock = Math.max(0, newStock - baseQuantity);
        }

        const calculatedStatus =
          newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= p.minStock ? 'LOW_STOCK' : 'IN_STOCK';

        return {
          ...p,
          stock: newStock,
          status: calculatedStatus,
          lastUpdated: new Date(),
        };
      }),
    );

    this.returnLogs.update((logs) => [returnRecord, ...logs]);

    this.closeReturnModal();
  }
}
