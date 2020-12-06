import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileTransferServiceService {

  constructor(private http: HttpClient) { }

  downloadFile(): Observable<any>{
    return this.http.get('http://localhost:5000/download-receipt', {responseType: 'blob', withCredentials: true});
  }
}
