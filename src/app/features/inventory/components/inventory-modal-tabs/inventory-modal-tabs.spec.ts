import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryModalTabs } from './inventory-modal-tabs';

describe('InventoryModalTabs', () => {
  let component: InventoryModalTabs;
  let fixture: ComponentFixture<InventoryModalTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryModalTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryModalTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
