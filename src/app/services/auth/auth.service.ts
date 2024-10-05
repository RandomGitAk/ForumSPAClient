import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { TokenResponse, RegisterResponse } from '../../../types';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  http = inject(HttpClient)
  router = inject(Router)
  cookieService = inject(CookieService)
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuth);

  constructor() {  
    this.token = this.cookieService.get('token');
    this.refreshToken = this.cookieService.get('refreshToken');}
  baseApiUrl = `${this.baseUrl}/Auth/`;
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(){
    if(!this.token){
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !! this.token
  } 

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(payload: {username: string, password: string}){
    return this.http.post<TokenResponse>(
        `${this.baseApiUrl}token`,
         payload
      ).pipe(
          tap(val => {
            this.saveTokens(val);
            this.loggedIn.next(true);
          })
        )
  }

  register(payload: { firstName: string, lastName: string, email: string, password: string }){
    return this.http.post<RegisterResponse>(`${this.baseUrl}/Users`, payload);
  }


  refreshAuthToken(){
    return this.http.put<TokenResponse>(
         `${this.baseApiUrl}token`,
         {
          refreshToken: this.refreshToken,
         })
         .pipe(
          tap(val => {this.saveTokens(val)}),
          catchError(err => {
            this.logout()
            return throwError(err)
          })
         )
  }

  
  logout() {
    this.http.delete(`${this.baseUrl}token`, {})
      .subscribe({
        next: () => {
          this.cookieService.delete('token', '/');
          this.cookieService.delete('refreshToken', '/');
          this.token = null;
          this.refreshToken = null;
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error during logout:', err);
          this.cookieService.delete('token', '/');
          this.cookieService.delete('refreshToken', '/');
          this.token = null;
          this.refreshToken = null;
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        }
      });
  }

  
   decodeToken(token: string): any {
    if (!token) {
      return null;
    }
  
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload); 
    return JSON.parse(decodedPayload); 
  }
  
  getEmailFromToken(): string | null {
    if (this.token) {
      const decoded = this.decodeToken(this.token);
      return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null; 
    }
    return null; 
  }

  getRoleFromClaims(): string {
    if (!this.token) return '';
    const decoded = this.decodeToken(this.token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || ''; 
  } 

  hasRole(role: string): boolean {
    const userRole = this.getRoleFromClaims();
    return userRole === role || userRole === 'Admin'; 
  }

  private saveTokens(res: TokenResponse){
    this.token = res.accesToken
    this.refreshToken = res.refreshToken

    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
  }
}
