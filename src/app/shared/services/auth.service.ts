import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../../model/User';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../../appconst';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {NetworkService} from './network.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        public router: Router,
        private dialogRef: MatDialog,
    ) {
        let gateUser = sessionStorage.getItem('gateUser');
        if (!gateUser) {
            gateUser = localStorage.getItem('gateUser');
        }
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(gateUser));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public setCurrentUserValue(value: User) {
        this.currentUserSubject.next(value);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password, remember) {
        return this.http.post<any>(AppConst.HOST_URL + AppConst.ADMIN_SIGNIN_API,
            {username, password})
            .pipe(map(response => {
                if (response && !response.error_code) {
                    if (remember) {
                        localStorage.setItem('gateUser', JSON.stringify(response.data));
                    } else {
                        sessionStorage.setItem('gateUser', JSON.stringify(response.data));
                    }
                    this.currentUserSubject.next(response.data);
                }
                return response;
            },
                error => {
                    console.log(error); }));
    }

    logout() {
        return this.http.post<any>(AppConst.HOST_URL + AppConst.ADMIN_SIGNOUT_API, {})
            .pipe(map((response => {
                if (response.error_code === 500 || response.error_code === 5 || response.error_code === 7) {
                    localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
                    localStorage.removeItem('CREDENTIALS_FLUSH');
                    localStorage.clear();
                    sessionStorage.clear();
                    this.currentUserSubject.next(null);
                    this.dialogRef.closeAll();
                    this.router.navigateByUrl('/login');
                    return;
                } else {
                    return response;
                }
            })));
    }

    isLoggedIn() {
        let gateUser = sessionStorage.getItem('gateUser');
        if (!gateUser) {
            gateUser = localStorage.getItem('gateUser');
        }
        return !!gateUser;
    }
}
