import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { InventoryTable } from './components/inventory-table/inventory-table';
import { InventoryProductModal } from './components/inventory-product-modal/inventory-product-modal';
import { InventoryFilters } from './components/inventory-filters/inventory-filters';
import { InventoryReturnModal } from './components/inventory-return-modal/inventory-return-modal';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    InventoryTable,
    InventoryProductModal,
    InventoryReturnModal,
    InventoryFilters,
  ],
  templateUrl: './inventory.html',
})
export class Inventory {
  readonly store = inject(InventoryStore);
}
