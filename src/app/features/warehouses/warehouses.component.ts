import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideWarehouse, LucidePlus, LucideTriangleAlert } from '@lucide/angular';

import { WarehouseStore } from '../../core/stores/warehouse.store';
import { WarehouseFormModalComponent } from './components/warehouse-form-modal/warehouse-form-modal.component';
import { WarehouseTableComponent } from './components/warehouse-table/warehouse-table.component';
import { WarehouseFiltersComponent } from './components/warehouse-filters/warehouse-filters.component';
import { WarehouseKpisComponent } from './components/warehouse-kpis/warehouse-kpis.component';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule,
    LucideWarehouse,
    LucidePlus,
    LucideTriangleAlert,
    WarehouseKpisComponent,
    WarehouseFiltersComponent,
    WarehouseTableComponent,
    WarehouseFormModalComponent,
  ],
  templateUrl: './warehouses.component.html',
})
export class WarehousesComponent {
  readonly store = inject(WarehouseStore);
}
