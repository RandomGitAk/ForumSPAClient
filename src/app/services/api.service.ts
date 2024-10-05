import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Options } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  get<T>(url: string, options: Options): Observable<T>{
    return this.httpClient.get<T>(url, options);
  }
  
  post<T>(url: string, body: any) : Observable<T>{
    return this.httpClient.post<T>(url, body);
  }

  put<T>(url: string, body: any) : Observable<T>{
    return this.httpClient.put<T>(url, body);
  }
  patch<T>(url: string, body: any) : Observable<T>{
    return this.httpClient.patch<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}
