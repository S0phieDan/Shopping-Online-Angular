import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItemModel } from '../model/cartItem.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<CartItemModel[]>{
    return this.http.get<CartItemModel[]>('/api/cart', httpOptions);
  }

  deleteCartItem(cartItem_id:string): Observable<string>{
    return this.http.post<string>('/api/delete', {cartItem_id: cartItem_id}, httpOptions);
  }

  clearCart(): Observable<String>{
    return this.http.get<String>('/api/clearCart', httpOptions);
  }
}
