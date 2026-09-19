import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEntryMode } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-scanner-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-header.html',
})
export class ScannerHeader {
  entryMode = input.required<DataEntryMode>();
}
