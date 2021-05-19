import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
        return true;
    }
}
