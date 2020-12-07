import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../model/product.model';
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
export class ProductListServiceService {

  constructor(private http: HttpClient) { }

  getProductList(categoryName: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('http://localhost:5000/products/' + categoryName, httpOptions);
  }

  searchProduct(productName: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('http://localhost:5000/search/' + productName, httpOptions);
  }

  addProduct(item: any): Observable<CartItemModel> {
    return this.http.post<CartItemModel>('http://localhost:5000/cart', item, httpOptions);
  }
}
