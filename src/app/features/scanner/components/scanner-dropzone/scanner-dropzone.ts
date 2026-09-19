import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanner-dropzone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-dropzone.html',
})
export class ScannerDropzone {
  isScanning = input<boolean>(false);
  previewUrl = input<string | null>(null);

  fileSelected = output<File>();
  removeFile = output<void>();

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
