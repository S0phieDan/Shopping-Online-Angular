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
export class NewProductFormServiceService {
  
  constructor(private http: HttpClient) { }

  insertImage(fd:FormData): Observable<any>{
    return this.http.post<any>('/api/api/images', fd, {});
  }
}
