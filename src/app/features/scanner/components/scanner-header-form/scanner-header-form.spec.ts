import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerHeaderForm } from './scanner-header-form';

describe('ScannerHeaderForm', () => {
  let component: ScannerHeaderForm;
  let fixture: ComponentFixture<ScannerHeaderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerHeaderForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerHeaderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
