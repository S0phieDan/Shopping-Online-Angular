import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CartItemModel } from '../../model/cartItem.model';
import { CartServiceService } from '../../services/cart-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.css']
})
export class CartOrderComponent implements OnInit {
  cartItems: CartItemModel[] = [];
  totalSum: number = 0;
  @Output() totalSumEvent = new EventEmitter<number>();
  searchInput: string;

  constructor(private cartService: CartServiceService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((data: CartItemModel[]) => {
      if (data)
        this.cartItems = data;
      this.cartItems.forEach(cartItem => this.totalSum += cartItem.price);
      this.totalSumEvent.emit(this.totalSum);
    });
  }

  backToShop(): void {
    this.router.navigate(['store']);
  }

  receiveSearchInOrderEvent(value: string): void {
    this.searchInput = value;
  }
}
