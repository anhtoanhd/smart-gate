import {Injectable, NgZone} from '@angular/core';
import {AppConst} from '../../appconst';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

    lastAction = AppConst.MINUTES_UNITL_AUTO_LOGOUT;

    constructor(
        private auth: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) {
        this.check();
        this.initListener();
        this.initInterval();
    }

    initListener() {
        this.ngZone.runOutsideAngular(() => {
            document.body.addEventListener('click', () => this.reset());
        });
    }

    initInterval() {
        this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
                if (this.lastAction > 0) {
                    this.check();
                }
            }, AppConst.CHECK_INTERVALL);
        });
    }

    reset() {
        this.lastAction = AppConst.MINUTES_UNITL_AUTO_LOGOUT;
    }

    check() {
        if (this.auth.isLoggedIn() && !localStorage.getItem('gateUser')) {
            this.lastAction--;
            this.ngZone.run(() => {
                if (!this.lastAction) {
                    this.auth.logout().subscribe();
                }
            });
        }
    }
}
