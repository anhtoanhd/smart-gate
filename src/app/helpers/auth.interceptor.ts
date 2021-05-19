import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let gateUser = sessionStorage.getItem('gateUser');
        if (!gateUser) {
            gateUser = localStorage.getItem('gateUser');
        }
        const user = JSON.parse(gateUser);
        request = request.clone({
            setHeaders: {
                Authorization:  user ? 'Bearer ' + user.token : 'null',
                Accept: 'application/json, text/plain, */*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
                // 'X-Requested-With': 'XMLHttpRequest'
            }
        });
        return next.handle(request);
    }
}
