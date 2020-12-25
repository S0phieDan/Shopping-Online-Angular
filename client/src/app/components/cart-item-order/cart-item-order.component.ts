import { Component, OnInit, Input } from '@angular/core';
import { CartItemModel } from '../../model/cartItem.model';

@Component({
  selector: 'app-cart-item-order',
  templateUrl: './cart-item-order.component.html',
  styleUrls: ['./cart-item-order.component.css']
})
export class CartItemOrderComponent implements OnInit {
  @Input() cartItem: CartItemModel;
  @Input() isExpanded: boolean;
  @Input() query: string;

  constructor() { }

  ngOnInit(): void {
  }

  public highlight() {
    if (!this.query) {
      return this.cartItem.product_id.name;
    }
    return this.cartItem.product_id.name.replace(new RegExp(this.query, "gi"), match => {
      return '<mark>' + match + '</mark>';
    });
  }

}
