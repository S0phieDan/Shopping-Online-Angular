import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class StoreDataServiceService {

  constructor(private http: HttpClient) { }

  getAmountOfProducts(): Observable<Number> {
    return this.http.get<Number>('/api/products-amount', httpOptions);
  }

  getAmountOfOrders(): Observable<Number> {
    return this.http.get<Number>('/api/orders-amount', httpOptions);
  }
}
