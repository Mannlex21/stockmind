import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-warehouse-filters',
  standalone: true,
  imports: [FormsModule, LucideSearch],
  templateUrl: './warehouse-filters.component.html',
})
export class WarehouseFiltersComponent {
  readonly searchQuery = model<string>('');
  readonly selectedStatus = model<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
}
