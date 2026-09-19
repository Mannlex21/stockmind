import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucidePencil, LucideTrash, LucideShoppingCart } from '@lucide/angular';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-warehouse-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ProgressSpinnerModule,
    LucidePencil,
    LucideTrash,
    LucideShoppingCart,
  ],
  templateUrl: './warehouse-table.component.html',
})
export class WarehouseTableComponent {
  readonly warehouses = input.required<Warehouse[]>();
  readonly isLoading = input<boolean>(false);

  readonly edit = output<Warehouse>();
  readonly delete = output<string>();
  readonly toggleStatus = output<string>();
}
