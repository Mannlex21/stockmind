import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { WarehouseStore } from '../../core/stores/warehouse.store';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TagModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './warehouses.component.html',
})
export class WarehousesComponent {
  readonly store = inject(WarehouseStore);
}
