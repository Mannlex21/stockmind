import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryProductModal } from './inventory-product-modal';

describe('InventoryProductModal', () => {
  let component: InventoryProductModal;
  let fixture: ComponentFixture<InventoryProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryProductModal],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryProductModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
