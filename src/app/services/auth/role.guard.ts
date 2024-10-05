import { AuthService } from './auth.service'; // Імпортуйте ваш сервіс авторизації
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as Array<string>;
    return roles ? roles.some(role => this.authService.hasRole(role)) : false;
  }
}
