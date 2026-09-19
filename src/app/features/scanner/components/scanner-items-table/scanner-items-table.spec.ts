import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerItemsTable } from './scanner-items-table';

describe('ScannerItemsTable', () => {
  let component: ScannerItemsTable;
  let fixture: ComponentFixture<ScannerItemsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerItemsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerItemsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
