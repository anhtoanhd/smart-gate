import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
