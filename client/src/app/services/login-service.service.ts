import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartModel } from '../model/cart.model';
import { ResponseModel } from '../model/response.model';
import { OrderModel } from '../model/order.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }

  loginUser(email:String, password:String): Observable<ResponseModel>{
    return this.http.post<ResponseModel>('/api/login',{email, password},  httpOptions);
  }

  checkAuthorization(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>('/api/authorization', httpOptions);
  }

  createNewCart(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>('/api/newCart', httpOptions);
  }

  destroySession(): Observable<ResponseModel>{
    return this.http.get<ResponseModel>('/api/destroy-session', httpOptions);
  }

  getCartDetails(): Observable<CartModel>{
    return this.http.get<CartModel>('/api/cart/details', httpOptions);
  }

  getOrderDetails(): Observable<any>{
    return this.http.get<any>('/api/order/details', httpOptions);
  }
}
