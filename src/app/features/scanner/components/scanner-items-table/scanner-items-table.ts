import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceItemScan } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-scanner-items-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner-items-table.html',
})
export class ScannerItemsTable {
  items = input.required<InvoiceItemScan[]>();

  addItem = output<void>();
  removeItem = output<number>();
  verifyItem = output<number>();
  itemUpdated = output<{ index: number; field: keyof InvoiceItemScan; value: any }>();

  updateField(index: number, field: keyof InvoiceItemScan, value: any): void {
    this.itemUpdated.emit({ index, field, value });
  }
}
