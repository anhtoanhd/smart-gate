import {Component, OnInit} from '@angular/core';
import {FormComponent} from '../components/form/form.component';
import { MatDialog } from '@angular/material/dialog';
import {AppConst} from '../../appconst';
import {CommonService, NetworkService} from '../../shared/services';
import {AccessRoleComponent} from '../components/access-role/access-role.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    listAccount: any = [];
    listEditAccount = [];
    itemPerPage = 10;
    totalPages: number;
    order = '';
    direction = '';
    key_word = '';
    selectedAccounts: any = [];
    currentPage = 1;
    userId: any;
    permission: any = [];
    isLoading = false;

    constructor(
        private dialog: MatDialog,
        private networkService: NetworkService,
        public commonService: CommonService
    ) {
    }

    ngOnInit() {
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word);
        this.userId = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).id;
        this.networkService.getPermission(this.userId).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.permission = response.data;
                }
            }
        );
    }

    setPage(itemPerPage: any, page: number, order: any, direction: any, key_word: any, timeDelay = 500) {
        this.currentPage = page;
        this.selectedAccounts = [];
        this.loadListAccount(itemPerPage, page, order, direction, key_word, timeDelay);
    }

    loadListAccount(itemPerPage: number, currentPage: number, order: string, direction: string, keyword: string, timeDelay) {
        if (timeDelay) {
            this.isLoading = true;
        }
        const params = {};
        params['limit'] = itemPerPage;
        params['page'] = currentPage;
        if (order) {
            params['order'] = order;
        }
        if (direction) {
            params['direction'] = direction;
        }
        if (keyword) {
            params['key_word'] = keyword;
        }
        this.networkService.get(AppConst.ACCOUNT_LIST_API, params, timeDelay).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.totalPages = Number(response.data.last_page);
                    this.listAccount = [...response.data.data];
                    this.listEditAccount = this.listAccount.filter(x => x['is_edit']);
                    if (this.currentPage > 1 && this.listAccount.length === 0) {
                        this.currentPage--;
                        this.setPage(itemPerPage, this.currentPage, order, direction, keyword, timeDelay);
                    }
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.isLoading = false;
            });
    }

    onOpenFormDialog(accountId, isEdit) {
        if (isEdit) {
            const dialogRef = this.dialog.open(FormComponent, {
                disableClose: true,
                width: '670px',
                data: {
                    formType: 'account',
                    id: accountId
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (typeof result === 'boolean') {
                        if (accountId) {
                            this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                () => {
                                    this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                }
                            );
                        } else {
                            this.commonService.confirmDialog(this.dialog, 'success', 'Create success!', null, null, true, 1000).then(
                                () => {
                                    this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                }
                            );
                        }
                    }
                } else {
                    if (typeof result === 'boolean') {
                        this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                    }
                }
            });
        }
    }

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Account information', 'Confirm warning delete account', 'Confirm note delete account').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    this.selectedAccounts.forEach((account, index) => {
                        params['id[' + index + ']'] = account.id;
                    });
                    this.networkService.delete(AppConst.ACCOUNT_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                        this.selectedAccounts = [];
                                    }
                                );
                            } else {
                                this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
                            }
                        },
                        error => {
                            console.log(error);
                            this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                        },
                        () => {
                            this.isLoading = false;
                        }
                    );
                }
            }
        );
    }

    onSelectAllChange(event) {
        if (event.target.checked) {
            this.selectedAccounts = [];
            this.listAccount.forEach(staff => {
                if (staff['is_edit']) {
                    staff.isChecked = true;
                    this.selectedAccounts.push(staff);
                }
            });
        } else {
            this.listAccount.forEach(staff => {
                staff.isChecked = false;
            });
            this.selectedAccounts = [];
        }
    }

    onAccountCheckedChange(event, account) {
        if (event.target.checked) {
            this.selectedAccounts.push(account);
            account.isChecked = true;
        } else {
            this.selectedAccounts.splice(this.selectedAccounts.indexOf(account, 0), 1);
            account.isChecked = false;
        }
    }

    onAccessRoleClick() {
        const dialogRef = this.dialog.open(AccessRoleComponent, {
            disableClose: true,
            width: '670px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000);
                }
            } else {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        });
    }

    onSearchInputChange(event: string) {
        this.key_word = event;
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word);
    }
}
