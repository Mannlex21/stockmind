import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStore } from '../../../../core/services/inventory-store.service';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.html',
})
export class InventoryTable {
  readonly store = inject(InventoryStore);
}
