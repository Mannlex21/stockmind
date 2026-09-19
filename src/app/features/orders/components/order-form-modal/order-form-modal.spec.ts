import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderFormModal } from './order-form-modal';

describe('OrderFormModal', () => {
  let component: OrderFormModal;
  let fixture: ComponentFixture<OrderFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
