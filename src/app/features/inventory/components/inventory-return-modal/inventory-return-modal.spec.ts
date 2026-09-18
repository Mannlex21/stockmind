import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryReturnModal } from './inventory-return-modal';

describe('InventoryReturnModal', () => {
  let component: InventoryReturnModal;
  let fixture: ComponentFixture<InventoryReturnModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryReturnModal],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryReturnModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
