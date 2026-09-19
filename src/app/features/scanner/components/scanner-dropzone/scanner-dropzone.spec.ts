import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerDropzone } from './scanner-dropzone';

describe('ScannerDropzone', () => {
  let component: ScannerDropzone;
  let fixture: ComponentFixture<ScannerDropzone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerDropzone],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerDropzone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
