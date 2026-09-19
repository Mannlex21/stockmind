// src/app/features/orders/components/order-form-modal/order-form-modal.ts
import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  FormArray,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  PurchaseOrder,
  PurchaseOrderItem,
  OrderStatus,
} from '../../../../core/models/orders.model';

@Component({
  selector: 'app-order-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form-modal.html',
})
export class OrderFormModalComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  isOpen = input<boolean>(false);
  orderToEdit = input<PurchaseOrder | null>(null);

  closeModal = output<void>();
  saveOrder = output<Partial<PurchaseOrder>>();

  form = this.fb.group({
    supplier: ['', Validators.required],
    status: ['draft' as OrderStatus, Validators.required],
    notes: [''],
    items: this.fb.array<FormGroup>([]),
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.populateForm(this.orderToEdit());
      }
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  newItemGroup(item?: Partial<PurchaseOrderItem>): FormGroup {
    return this.fb.group({
      productId: [item?.productId || `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`],
      productName: [item?.productName || '', Validators.required],
      quantityToOrder: [item?.quantityToOrder || 1, [Validators.required, Validators.min(1)]],
      estimatedCost: [item?.estimatedCost || 0, [Validators.required, Validators.min(0)]],
      supplier: [item?.supplier || ''],
    });
  }

  addItem(): void {
    this.items.push(this.newItemGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(): number {
    return this.items.controls.reduce((acc, ctrl) => {
      const qty = ctrl.get('quantityToOrder')?.value || 0;
      const cost = ctrl.get('estimatedCost')?.value || 0;
      return acc + qty * cost;
    }, 0);
  }

  private populateForm(order: PurchaseOrder | null): void {
    this.items.clear();
    if (order) {
      this.form.patchValue({
        supplier: order.supplier,
        status: order.status,
        notes: order.notes || '',
      });
      order.items.forEach((item) => this.items.push(this.newItemGroup(item)));
    } else {
      this.form.reset({ supplier: '', status: 'draft', notes: '' });
      this.addItem();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: Partial<PurchaseOrder> = {
      supplier: raw.supplier,
      status: raw.status,
      notes: raw.notes,
      items: raw.items as PurchaseOrderItem[], // Casteo explícito a la interfaz requerida
      totalCost: this.calculateTotal(),
      entryMode: 'MANUAL',
    };

    this.saveOrder.emit(payload);
    this.closeModal.emit();
  }
}
