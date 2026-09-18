import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryStore } from '../../../../core/services/inventory-store.service';

@Component({
  selector: 'app-inventory-modal-tabs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-modal-tabs.html',
})
export class InventoryModalTabs {
  readonly store = inject(InventoryStore);
  readonly product = this.store.editingProduct;
}
