import {Component, OnInit} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {AppConst} from '../../appconst';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    id: any;
    account: any = {};
    roles = [];
    resErrors: any = {};
    isLoading: any;

    constructor(
        private networkService: NetworkService,
        private commonService: CommonService,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadRoles();
        this.loadAccount();
    }

    loadAccount() {
        this.isLoading = true;
        this.id = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).id;
        this.networkService.get(AppConst.ACCOUNT_SHOW_API + '/' + this.id, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.account = response.data;
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    loadRoles() {
        this.networkService.get(AppConst.ROLE_LIST_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    response.data.forEach(role => {
                        this.roles = [...this.roles, {id: role.id, name: role.name}];
                    });
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    onAccountFormSubmit() {
        this.isLoading = true;
        const formData = new FormData();
        formData.set('id', this.account.id);
        formData.set('password', this.account.old_password ? this.account.old_password : '');
        formData.set('new_password', this.account.new_password ? this.account.new_password : '');
        formData.set('is_send_email', '1');
        this.networkService.post(AppConst.ADMIN_CHANGE_PASSWORD_API + '/' + this.account.id, formData).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                        () => {
                            this.router.navigateByUrl('/overview');
                        }
                    );
                } else {
                    this.resErrors = response['field'];
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    return false;
    }
}
