import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { LucideWarehouse, LucideLoader } from '@lucide/angular';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-warehouse-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, LucideWarehouse, LucideLoader],
  templateUrl: './warehouse-form-modal.html',
})
export class WarehouseFormModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly form = input<Partial<Warehouse> | null>(null);
  readonly isLoading = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<void>();
}
