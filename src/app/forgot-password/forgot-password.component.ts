import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NetworkService} from '../shared/services';
import {AppConst} from '../appconst';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    userEmail: any;
    isSubmitted: any;
    errors: any = {};

    constructor(
        private translate: TranslateService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.translate.use('vi');
    }

    onForgotSubmit() {
        this.isSubmitted = true;
        const formData = new FormData();
        formData.set('email', this.userEmail.trim());
        this.http.post<any>(AppConst.HOST_URL + AppConst.ADMIN_FORGOT_PASSWORD_API, formData).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.router.navigateByUrl('/login');
                    this.toastr.show(this.translate.instant('Sent mail to create a new password successfully!'), null, {
                        timeOut: 5000,
                        tapToDismiss: true,
                        toastClass: 'forgot-toast'
                    });
                } else if (response.error_code === 2) {
                    this.errors = response.field;
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.isSubmitted = false;
            }
        );
    }
}
