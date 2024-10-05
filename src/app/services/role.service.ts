import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {}

  getRoles(url:string) : Observable<Role[]> {
    return this.http.get<Role[]>(url);
  }
}
