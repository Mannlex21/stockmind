import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerHeader } from './scanner-header';

describe('ScannerHeader', () => {
  let component: ScannerHeader;
  let fixture: ComponentFixture<ScannerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
