import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItemModel } from '../model/cartItem.model';
import { ResponseModel } from '../model/response.model';
import { ProductModel } from '../model/product.model';
import { OrderModel } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private cartItemToAdd = new Subject<CartItemModel>();
  currentCartItemToAdd = this.cartItemToAdd.asObservable();

  private userData = new Subject<ResponseModel>();
  currentUserData = this.userData.asObservable();

  private productToUpdate = new Subject<ProductModel>();
  currentProductToUpdate = this.productToUpdate.asObservable();

  constructor() { }

  addCartItemToCart(cartItem: CartItemModel) {
    this.cartItemToAdd.next(cartItem);
  }

  changeUserData(data: ResponseModel) {
    this.userData.next(data);
  }

  updateProduct(product: ProductModel) {
    this.productToUpdate.next(product);
  }

}
