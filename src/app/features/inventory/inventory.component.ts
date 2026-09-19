import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../core/services/inventory-store.service';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';
import { InventoryProductModalComponent } from './components/inventory-product-modal/inventory-product-modal.component';
import { InventoryFiltersComponent } from './components/inventory-filters/inventory-filters.component';
import { InventoryReturnModal } from './components/inventory-return-modal/inventory-return-modal.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    InventoryTableComponent,
    InventoryProductModalComponent,
    InventoryReturnModal,
    InventoryFiltersComponent,
  ],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {
  readonly store = inject(InventoryStore);
}
