import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemOrderComponent } from './cart-item-order.component';

describe('CartItemOrderComponent', () => {
  let component: CartItemOrderComponent;
  let fixture: ComponentFixture<CartItemOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
