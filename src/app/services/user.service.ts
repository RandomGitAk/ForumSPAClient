import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PaginationParams, User, Users } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }
  getUsers = (url: string, params: PaginationParams): Observable<Users> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
    });
   }

   updateUserRole(url: string, roleId: number): Observable<any> {
    const payload = { roleId }; 
    return this.apiService.patch(url, payload); 
  }

  deleteUser(url: string): Observable<User> {
    return this.apiService.delete(url);
  }

  getMe(url: string){
    return this.apiService.get<User>(url,{})
  }

  updateUserInfo(url:string, userData: any): Observable<any> {
    return this.apiService.put<User>(url, userData);
  }
}
