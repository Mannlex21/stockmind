import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideWarehouse, LucidePlus, LucideTriangleAlert } from '@lucide/angular';

import { WarehouseStore } from '../../core/stores/warehouse.store';
import { WarehouseFiltersComponent } from './components/warehouse-filters/warehouse-filters';
import { WarehouseKpisComponent } from './components/warehouse-kpis/warehouse-kpis';
import { WarehouseTableComponent } from './components/warehouse-table/warehouse-table';
import { WarehouseFormModalComponent } from './components/warehouse-form-modal/warehouse-form-modal';

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
  templateUrl: './warehouses.html',
})
export class WarehousesComponent {
  readonly store = inject(WarehouseStore);
}
