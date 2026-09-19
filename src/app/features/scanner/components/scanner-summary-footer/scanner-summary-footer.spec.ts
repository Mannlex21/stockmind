import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerSummaryFooter } from './scanner-summary-footer';

describe('ScannerSummaryFooter', () => {
  let component: ScannerSummaryFooter;
  let fixture: ComponentFixture<ScannerSummaryFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerSummaryFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerSummaryFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
