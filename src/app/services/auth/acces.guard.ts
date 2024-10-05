import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { CanActivateFn } from "@angular/router";

export const canActivateAuth: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const isLoggedIn = authService.isAuth;

    if (isLoggedIn) {
        return true;
    }

    return router.createUrlTree(['/login']);
};