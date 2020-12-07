import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CartItemModel } from '../../model/cartItem.model';
import { CartServiceService } from '../../services/cart-service.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../../shared_styles/shared.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItemModel[] = [];
  cartItem: CartItemModel;
  oldLength: number = 0;
  newLength: number;
  totalSum: number = 0;
  @Output() changeCartSizeEvent = new EventEmitter<Boolean>();
  isExpanded: boolean = true;
  @ViewChild('cartBody') private cartBody: ElementRef;

  constructor(private cartService: CartServiceService, private sharedService: SharedServiceService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((data: CartItemModel[]) => {
      if (data) {
        this.cartItems = data;
        this.cartItems.forEach(cartItem => this.totalSum += cartItem.price);
        this.oldLength = this.cartItems.length;
      }
    });

    this.sharedService.currentCartItemToAdd.subscribe(cartItem => {
      if (cartItem) {
        this.cartItem = cartItem;
        this.cartItems.push(this.cartItem);
        this.totalSum += this.cartItem.price;
        this.newLength = this.cartItems.length;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.newLength && this.oldLength != this.newLength) {
      this.cartBody.nativeElement.scrollTo({
        top: this.cartBody.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  receiveDeleteCartItemEvent(cartItem: CartItemModel): void {
    if (cartItem) {
      this.cartItems = this.cartItems.filter(item => item._id !== cartItem._id);
      this.totalSum -= cartItem.price;
      this.deleteCartItemFromDB(cartItem._id);
    }
  }

  deleteCartItemFromDB(cartItem_id: string): void {
    this.cartService.deleteCartItem(cartItem_id).subscribe((data: String) => {
      if (data)
        console.log(data);
    })
  }

  deleteAllCartItems(): void {
    this.cartService.clearCart().subscribe((data: String) => {
      if (data)
        this.cartItems = [];
      this.totalSum = 0;
    });
  }

  changeCartSize(value: boolean): void {
    if (value) {
      //minimized cart
      this.changeCartSizeEvent.emit(true);
      this.isExpanded = false;
    }
    else {
      //expended cart
      this.changeCartSizeEvent.emit(false);
      this.isExpanded = true;
    }
  }

  orderNow(): void {
    if (this.cartItems.length) {
      this.router.navigate(['store/order-details']);
    }
  }
}
