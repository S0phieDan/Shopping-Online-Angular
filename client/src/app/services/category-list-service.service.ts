import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../model/category.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class CategoryListServiceService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryModel[]>{
    return this.http.get<CategoryModel[]>('/api/categories', httpOptions);
  }
}
