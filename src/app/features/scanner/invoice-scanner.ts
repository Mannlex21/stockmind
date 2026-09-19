import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Subcomponentes modulares
import { ScannerSummaryFooter } from './components/scanner-summary-footer/scanner-summary-footer';
import { ScannerItemsTable } from './components/scanner-items-table/scanner-items-table';
import { ScannerHeaderForm } from './components/scanner-header-form/scanner-header-form';
import { ScannerDropzone } from './components/scanner-dropzone/scanner-dropzone';
import { ScannerHeader } from './components/scanner-header/scanner-header';

// Modelos de datos
import {
  DataEntryMode,
  InvoiceItemScan,
  InvoiceScanResult,
} from '../../core/models/inventory.model';

@Component({
  selector: 'app-invoice-scanner',
  standalone: true,
  imports: [
    CommonModule,
    ScannerHeader,
    ScannerDropzone,
    ScannerHeaderForm,
    ScannerItemsTable,
    ScannerSummaryFooter,
  ],
  templateUrl: './invoice-scanner.html',
})
export class InvoiceScanner {
  entryMode = signal<DataEntryMode>('MANUAL');
  isScanning = signal<boolean>(false);
  previewUrl = signal<string | null>(null);

  invoiceData = signal<InvoiceScanResult>({
    invoiceNumber: '',
    supplierName: '',
    issueDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    items: [],
  });

  calculatedTotal = computed(() => {
    return this.invoiceData().items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  });

  private markAsEdited(): void {
    if (this.entryMode() === 'AI_GENERATED') {
      this.entryMode.set('AI_EDITED');
    }
  }

  onFileSelected(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.isScanning.set(true);

    // TODO: Llamada al servicio Gemini SDK (@google/genai)
    setTimeout(() => {
      this.entryMode.set('AI_GENERATED');
      this.invoiceData.set({
        invoiceNumber: 'FAC-2026-8921',
        supplierName: 'Distribuidora Lácteos del Norte',
        issueDate: '2026-09-18',
        totalAmount: 1450.0,
        items: [
          {
            description: 'Queso Panela 400g',
            quantity: 20,
            unitPrice: 45.0,
            totalPrice: 900.0,
            detectedPresentation: 'Caja 20 pzas',
            confidenceScore: 0.95,
            isManuallyVerified: false,
          },
        ],
      });
      this.isScanning.set(false);
    }, 1500);
  }

  updateHeader(field: keyof InvoiceScanResult, value: string): void {
    this.markAsEdited();
    this.invoiceData.update((state) => ({ ...state, [field]: value }));
  }

  onItemUpdated(event: { index: number; field: keyof InvoiceItemScan; value: any }): void {
    this.markAsEdited();
    this.invoiceData.update((state) => {
      const updatedItems = [...state.items];
      const item = { ...updatedItems[event.index], [event.field]: event.value };
      if (event.field === 'quantity' || event.field === 'unitPrice') {
        item.totalPrice = (item.quantity || 0) * (item.unitPrice || 0);
      }
      item.isManuallyVerified = true;
      updatedItems[event.index] = item;
      return { ...state, items: updatedItems };
    });
  }

  addItemManually(): void {
    this.markAsEdited();
    const newItem: InvoiceItemScan = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      isManuallyVerified: true,
    };
    this.invoiceData.update((s) => ({ ...s, items: [...s.items, newItem] }));
  }

  removeItem(index: number): void {
    this.markAsEdited();
    this.invoiceData.update((s) => ({ ...s, items: s.items.filter((_, i) => i !== index) }));
  }

  verifyItem(index: number): void {
    this.invoiceData.update((s) => {
      const updated = [...s.items];
      updated[index].isManuallyVerified = true;
      return { ...s, items: updated };
    });
  }

  saveInvoice(): void {
    const payload = {
      ...this.invoiceData(),
      entryMode: this.entryMode(),
      totalAmount: this.calculatedTotal(),
    };
    console.log('Guardando factura en .NET API:', payload);
  }
}
