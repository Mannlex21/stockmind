import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryModalTabs } from '../inventory-modal-tabs/inventory-modal-tabs';
import { InventoryStore } from '../../../../core/services/inventory-store.service';

@Component({
  selector: 'app-inventory-product-modal',
  standalone: true,
  imports: [CommonModule, InventoryModalTabs],
  templateUrl: './inventory-product-modal.html',
})
export class InventoryProductModal {
  readonly store = inject(InventoryStore);
}
