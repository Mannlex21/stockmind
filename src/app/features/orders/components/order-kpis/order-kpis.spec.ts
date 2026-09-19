import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderKpis } from './order-kpis';

describe('OrderKpis', () => {
  let component: OrderKpis;
  let fixture: ComponentFixture<OrderKpis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderKpis],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderKpis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
