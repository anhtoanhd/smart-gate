import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, delay, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AppConst} from '../../appconst';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router,
        private dialogRef: MatDialog
    ) {
    }

    get(url: string, params: any, delayTime = 500): Observable<any> {
        return this.http.get<any>(AppConst.HOST_URL + url,
            {
                params: params
            })
            .pipe(
                delay(delayTime),
                distinctUntilChanged(),
                map(response => {
                    if (response.error_code === 5 || response.error_code === 7) {
                        localStorage.clear();
                        sessionStorage.clear();
                        this.auth.setCurrentUserValue(null);
                        this.dialogRef.closeAll();
                        this.router.navigateByUrl('/login');
                    }
                    return response;
                }),
                tap(h => {
                    const outcome = h ? 'fetched' : 'did not find';
                }), catchError(this.handleError<any>('error'))
            );
    }

    getPermission(userId: any) {
        return this.get(AppConst.ROLE_FOR_USER_API + '/' + userId, {});
    }

    post(url: string, formData: FormData, delayTime = 500): Observable<any> {
        return this.http.post<any>(AppConst.HOST_URL + url, formData).pipe(
            delay(delayTime),
            map(response => {
                if (response.error_code === 5 || response.error_code === 7) {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.auth.setCurrentUserValue(null);
                    this.dialogRef.closeAll();
                    this.router.navigateByUrl('/login');
                }
                return response;
            }),
            tap(h => {
                const outcome = h ? 'fetched' : 'did not find';
            }),
            catchError(this.handleError<any>('error'))
        );
    }

    delete(url: string, params, delayTime = 500): Observable<any> {
        return this.http.delete<any>(AppConst.HOST_URL + url, {
            params: params
        })
            .pipe(
                delay(delayTime),
                map(response => {
                    if (response.error_code === 5 || response.error_code === 7) {
                        localStorage.clear();
                        sessionStorage.clear();
                        this.auth.setCurrentUserValue(null);
                        this.dialogRef.closeAll();
                        this.router.navigateByUrl('/login');
                    } else {
                        return response;
                    }
                }),
                tap(h => {
                    const outcome = h ? 'fetched' : 'did not find';
                }), catchError(this.handleError<any>('error'))
            );
    }

    private log(message: string) {
        console.log('message ' + message);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(error);
        };
    }
}
