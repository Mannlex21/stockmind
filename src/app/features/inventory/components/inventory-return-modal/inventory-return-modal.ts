import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryStore } from '../../../../core/services/inventory-store.service';
import { ReturnReason, ReturnType } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory-return-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-return-modal.html',
})
export class InventoryReturnModal {
  readonly store = inject(InventoryStore);

  returnType = signal<ReturnType>('CUSTOMER_RETURN');
  returnReason = signal<ReturnReason>('DAMAGED');
  returnQuantity = signal<number>(1);
  returnPresentationId = signal<string>('');
  restockInventory = signal<boolean>(false);
  returnNotes = signal<string>('');

  submit(): void {
    this.store.processReturn({
      type: this.returnType(),
      reason: this.returnReason(),
      quantity: this.returnQuantity(),
      presentationId: this.returnPresentationId(),
      restockInventory: this.restockInventory(),
      notes: this.returnNotes(),
    });
  }
}
