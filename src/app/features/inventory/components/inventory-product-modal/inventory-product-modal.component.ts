import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryModalTabsComponent } from '../inventory-modal-tabs/inventory-modal-tabs.component';
import { InventoryStore } from '../../../../core/services/inventory-store.service';

@Component({
  selector: 'app-inventory-product-modal',
  standalone: true,
  imports: [CommonModule, InventoryModalTabsComponent],
  templateUrl: './inventory-product-modal.component.html',
})
export class InventoryProductModalComponent {
  readonly store = inject(InventoryStore);
}
