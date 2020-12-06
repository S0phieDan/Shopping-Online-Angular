import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../model/user.model';
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
export class OrderDetailsServiceService {

  constructor(private http: HttpClient) { }

  getUserData(): Observable<UserModel>{
    return this.http.get<UserModel>('/api/user-data', httpOptions);
  }

  createNewOrder(order: OrderModel): Observable<any>{
    return this.http.post<any>('/api/order', order, httpOptions);
  }

  getOrderDates(): Observable<string[]>{
    return this.http.get<string[]>('/api/order', httpOptions);
  }
}
