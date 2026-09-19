import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanner-summary-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-summary-footer.html',
})
export class ScannerSummaryFooter {
  itemCount = input.required<number>();
  totalAmount = input.required<number>();

  confirmSave = output<void>();
}
