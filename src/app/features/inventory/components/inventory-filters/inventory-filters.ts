import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryStore } from '../../../../core/services/inventory-store.service';

@Component({
  selector: 'app-inventory-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-filters.html',
})
export class InventoryFilters {
  readonly store = inject(InventoryStore);
}
