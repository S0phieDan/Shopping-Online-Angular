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
    return this.http.get<ProductModel[]>('/api/products/' + categoryName, httpOptions);
  }

  searchProduct(productName: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('/api/search/' + productName, httpOptions);
  }

  addProduct(item: any): Observable<CartItemModel> {
    return this.http.post<CartItemModel>('/api/cart', item, httpOptions);
  }
}
