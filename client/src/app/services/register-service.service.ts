import { Injectable } from '@angular/core';
import { UserModel } from '../model/user.model';
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
export class RegisterServiceService {

  constructor(private http: HttpClient) { }

  createNewAccount(user: UserModel): Observable<boolean> {
    return this.http.post<boolean>('/api/register', user, httpOptions);
  }

  getIsraelCities(): Observable<any> {
    return this.http.get<any>('https://data.gov.il/api/3/action/datastore_search?resource_id=eb548bfa-a7ba-45c4-be7d-2e8271f55f70');
  }
}
