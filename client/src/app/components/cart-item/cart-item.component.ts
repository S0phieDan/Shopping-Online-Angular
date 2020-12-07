import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartItemModel } from '../../model/cartItem.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css', '../../shared_styles/shared.css']
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: CartItemModel;
  @Input() isExpanded: boolean;
  @Input() isOrder: boolean;
  @Output() deleteCartItemEvent: EventEmitter<CartItemModel> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deleteItemFromCart(cartItem: CartItemModel): void {
    this.deleteCartItemEvent.emit(cartItem);
  }
}
