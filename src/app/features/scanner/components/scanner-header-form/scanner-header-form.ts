import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scanner-header-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner-header-form.html',
})
export class ScannerHeaderForm {
  invoiceNumber = input<string>('');
  supplierName = input<string>('');
  issueDate = input<string>('');

  invoiceNumberChange = output<string>();
  supplierNameChange = output<string>();
  issueDateChange = output<string>();
}
