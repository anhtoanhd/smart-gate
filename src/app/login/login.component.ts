import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AuthService, NetworkService} from '../shared/services';
import {AppConst} from '../appconst';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    user: any = {};
    message: any;
    codePattern = AppConst.CODE_PATTERN;

    constructor(
        private router: Router,
        private toast: ToastrService,
        private http: HttpClient,
        private translate: TranslateService,
        private authService: AuthService,
        private networkService: NetworkService,
    ) { }

    ngOnInit() {
        this.translate.use('vi');
    }

    onLoginSubmit() {
        this.authService.login(
            this.user.username?.trim(),
            this.user.password?.trim(),
            this.user.remember).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.networkService.get(AppConst.ROLE_FOR_USER_API + '/' + response.data.id, {}).subscribe(
                        res => {
                            if (res && !res.error_code) {
                                localStorage.setItem('gatePer', JSON.stringify(res.data));
                            }
                        }
                    );
                    this.router.navigateByUrl('/');
                } else {
                    this.message = response.message;
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    onKeyup() {
        this.message = '';
    }

    onFieldInput() {
        this.message = '';
    }
}
