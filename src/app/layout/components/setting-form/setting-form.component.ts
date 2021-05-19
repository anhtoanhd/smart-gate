import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NetworkService} from '../../../shared/services';
import {AppConst} from '../../../appconst';

@Component({
    selector: 'app-setting-form',
    templateUrl: './setting-form.component.html',
    styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent implements OnInit {
    formSubmitted: any;
    sizes = [
        {id: '10', name: '10 Nhân viên'},
        {id: '100', name: '100 Nhân viên'},
        {id: '1000', name: '1000 Nhân viên'},
        {id: '10000', name: '10000 Nhân viên'},
    ];
    setting: any = {};
    codePattern = AppConst.CODE_PATTERN;

    constructor(
        public dialogRef: MatDialogRef<SettingFormComponent>,
        private networkService: NetworkService,
    ) {
    }

    ngOnInit() {
        this.setting['type'] = 'auto';
        this.setting['data_types'] = '3';
        this.loadSetting();
    }

    loadSetting() {
        this.formSubmitted = true;
        this.networkService.get(AppConst.STAFF_ADVANCE_SETTING_GET_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    this.setting = {...response.data};
                    if (this.setting['use_first']) {
                        this.setting['prefix'] = true;
                    }
                    if (this.setting['add_order']) {
                        this.setting['add_zero'] = true;
                    }
                }
            },
            error => console.log(error),
            () => this.formSubmitted = false
        );
    }

    onCancelClick() {
        this.dialogRef.close('close');
    }

    onSettingFormSubmit() {
        this.formSubmitted = true;
        const formData = new FormData();
        formData.set('type', this.setting['type']);
        if (this.setting['prefix']) {
            formData.set('use_first', this.setting['use_first']);
        }
        formData.set('code_area', this.setting['code_area'] ? '1' : '0');
        formData.set('code_department', this.setting['code_department'] ? '1' : '0');
        formData.set('auto_change', this.setting['auto_change'] ? '1' : '0');
        formData.set('order_by_new_area', this.setting['order_by_new_area'] ? '1' : '0');
        formData.set('data_types', this.setting['data_types']);

        this.networkService.post(AppConst.STAFF_ADVANCE_SETTING_API, formData).subscribe(
            response => {
                if (response && !response.error_code && !response.error) {
                    this.dialogRef.close(true);
                } else {
                    if (response.error_code === 2) {
                    } else if (response.error_code === 5) {
                        this.dialogRef.close('close');
                    } else {
                        this.dialogRef.close(undefined);
                    }
                }
            },
            error => {
                console.log(error);
                this.dialogRef.close(false);
            },
            () => {
                this.formSubmitted = false;
            }
        );
    }
}
