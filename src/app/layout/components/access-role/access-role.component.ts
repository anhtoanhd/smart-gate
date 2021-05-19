import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommonService, NetworkService} from '../../../shared/services';
import {AppConst} from '../../../appconst';

@Component({
    selector: 'app-access-role',
    templateUrl: './access-role.component.html',
    styleUrls: ['./access-role.component.scss']
})
export class AccessRoleComponent implements OnInit {
    isEdit = false;
    listRole = [];
    listPermission = [];
    accessRole: any = {};
    responseRole: any = {};
    formSubmitted: any;

    constructor(
        public dialogRef: MatDialogRef<AccessRoleComponent>,
        private networkService: NetworkService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadRole();
    }

    loadAccessRole() {
        this.networkService.get(AppConst.ACCESS_ROLE_LIST_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.responseRole = response.data;
                    for (const key in this.responseRole) {
                        if (this.responseRole.hasOwnProperty(key)) {
                            if (this.responseRole[key].includes(1)) {
                                this.accessRole[1]['insert'].push(Number(key));
                            } else {
                                this.accessRole[1]['delete'].push(Number(key));
                            }

                            if (this.responseRole[key].includes(2)) {
                                this.accessRole[2]['insert'].push(Number(key));
                            } else {
                                this.accessRole[2]['delete'].push(Number(key));
                            }

                            if (this.responseRole[key].includes(3)) {
                                this.accessRole[3]['insert'].push(Number(key));
                            } else {
                                this.accessRole[3]['delete'].push(Number(key));
                            }

                        }
                    }
                    console.log(this.accessRole);
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                this.formSubmitted = false;
            }
        );
    }

    loadRole() {
        this.formSubmitted = true;
        this.networkService.get(AppConst.ROLE_LIST_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listRole = response.data;
                    this.listRole.forEach(role => {
                        this.accessRole[role.id] = {insert: [], delete: []};
                    });
                    this.loadPermission();
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    loadPermission() {
        this.networkService.get(AppConst.PERMISSION_LIST_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listPermission = response.data;
                    this.listPermission.reverse();
                    this.loadAccessRole();
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    onClose() {
        this.dialogRef.close('close');
    }

    onSaveClick() {
        this.formSubmitted = true;
        const formData = new FormData();
        for (const key in this.accessRole) {
            if (this.accessRole.hasOwnProperty(key)) {
                formData.append('role[' + key + '][insert]', this.accessRole[key]['insert'].toString());
                formData.append('role[' + key + '][delete]', this.accessRole[key]['delete'].toString());
            }
        }
        this.networkService.post(AppConst.ACCESS_ROLE_STORE_API, formData).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.dialogRef.close(true);
                } else if (response.error_code === 5) {
                    this.dialogRef.close('close');
                } else {
                    this.dialogRef.close(undefined);
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => this.formSubmitted = false
        );
    }

    onCheckedChange(event, permission, index) {
        if (event.target.checked) {
            this.accessRole[index]['insert'].push(permission.id);
            this.accessRole[index]['delete'].splice(this.accessRole[index]['delete'].indexOf(permission.id), 1);
        } else {
            this.accessRole[index]['insert'].splice(this.accessRole[index]['insert'].indexOf(permission.id), 1);
            this.accessRole[index]['delete'].push(permission.id);
        }
    }
}
