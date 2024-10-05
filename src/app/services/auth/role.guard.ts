import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const roles = route.data['roles'] as Array<string>;

  return roles ? roles.some(role => authService.hasRole(role)) : false;
};