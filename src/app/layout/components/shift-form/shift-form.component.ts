import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {CommonService, NetworkService} from '../../../shared/services';
import {BsDatepickerDirective} from 'ngx-bootstrap/datepicker';
import {AppConst} from '../../../appconst';

@Component({
    selector: 'app-shift-form',
    templateUrl: './shift-form.component.html',
    styleUrls: ['./shift-form.component.scss']
})
export class ShiftFormComponent implements OnInit {

    shift: any = {};
    formSubmitted: any;
    id: any;
    resErrors: any = {};
    minDate: Date;
    locations = [];
    vnNameNumberPattern = AppConst.VN_NAME_NUMBER_PATTERN;
    codePattern = AppConst.CODE_PATTERN;

    constructor(
        public dialogRef: MatDialogRef<ShiftFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private networkService: NetworkService,
        public commonService: CommonService
    ) {
        this.minDate = new Date();
    }

    ngOnInit() {
        this.id = this.data.id;
        if (this.id) {
            this.showShift(this.id);
        }
        this.loadListLocation();
    }

    loadListLocation() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    response.data.forEach(area => {
                        this.locations = [...this.locations, {id: area.id, name: area.name}];
                    });
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    showShift(id) {
        this.formSubmitted = true;
        this.networkService.get(AppConst.SHIFT_SHOW_API + '/' + id, {id}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    this.shift = {...response.data};
                    this.shift['area_id'] = this.shift['area_id'].map(area => {
                        return Number(area);
                    });
                    this.shift['time_start'] = {
                        hour: Number(this.shift['time_start'].substr(0, 2)),
                        minute: Number(this.shift['time_start'].substr(3, 2))
                    };
                    this.shift['time_end'] = {
                        hour: Number(this.shift['time_end'].substr(0, 2)),
                        minute: Number(this.shift['time_end'].substr(3, 2))
                    };
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.formSubmitted = false;
            }
        );
    }
    onShiftFormSubmit() {
        this.formSubmitted = true;
        const start = new Date(2020, 0, 1, this.shift['time_start'].hour, this.shift['time_start'].minute, 0);
        const end = new Date(2020, 0, 1, this.shift['time_end'].hour, this.shift['time_end'].minute, 0);
        if (start.getTime() === end.getTime()) {
            this.resErrors['time_start'] = [...['Thời gian không đúng!']];
            this.resErrors['time_end'] = [...['Thời gian không đúng!']];
            this.formSubmitted = false;
            return;
        }
        const diffTime = this.commonService.getDiffTime(this.shift['time_start'], this.shift['time_end']);
        if ((this.shift['time_late'] && this.shift['time_late'] >= diffTime) || (this.shift['time_back'] && this.shift['time_back'] >= diffTime)) {
            if (this.shift['time_late'] && this.shift['time_late'] >= diffTime) {
                this.resErrors['time_late'] = [...['Phải nhỏ hơn độ dài ca!']];
            }
            if (this.shift['time_back'] && this.shift['time_back'] >= diffTime) {
                this.resErrors['time_back'] = [...['Phải nhỏ hơn độ dài ca!']];
            }
            this.formSubmitted = false;
            return false;
        }
        const formData = new FormData();
        formData.set('name', this.shift['name']);
        formData.set('code', this.shift['code']);
        formData.set('time_start', `${this.shift['time_start'].hour}:${this.shift['time_start'].minute}:00`);
        formData.set('time_end', `${this.shift['time_end'].hour}:${this.shift['time_end'].minute}:00`);
        this.shift['area_id'].forEach((id, index) => {
            formData.set('area_id[' + index + ']', id);
        });
        formData.set('time_late', this.shift['time_late'] ? this.shift['time_late'] : 0);
        formData.set('time_back', this.shift['time_back'] ? this.shift['time_back'] : 0);
        if (this.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.id);
            this.networkService.post(AppConst.SHIFT_UPDATE_API + '/' + this.id, formData).subscribe(
                response => {
                    if (response && !response.error_code && !response.error) {
                        this.dialogRef.close(true);
                    } else  {
                        if (response.error_code === 2) {
                            this.resErrors = {...response.field};
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
        } else {
            this.networkService.post(AppConst.SHIFT_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code && !response.error) {
                        this.dialogRef.close(true);
                    } else  {
                        if (response.error_code === 2) {
                            this.resErrors = {...response.field};
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

    onCancelClick() {
        this.dialogRef.close('close');
    }

    onInputChange(key) {
        this.resErrors[key] = [];
    }

    onStartTimeChange() {
        this.resErrors['time_start'] = [];
        this.resErrors['time_late'] = [];
        this.resErrors['time_back'] = [];
        if (!this.shift['time_start']) {
            const hour = <HTMLInputElement>document.querySelector(`#start fieldset input[aria-label="Hours"]`);
            const minute = <HTMLInputElement>document.querySelector(`#start fieldset input[aria-label="Minutes"]`);
            if (hour.value && !minute.value) {
                minute.value = '00';
                this.shift['time_start'] = {
                    hour: Number(hour.value),
                    minute: 0
                };
            }
        }
    }

    onEndTimeChange() {
        this.resErrors['time_end'] = [];
        this.resErrors['time_late'] = [];
        this.resErrors['time_back'] = [];
        if (!this.shift['time_end']) {
            const hour = <HTMLInputElement>document.querySelector(`#end fieldset input[aria-label="Hours"]`);
            const minute = <HTMLInputElement>document.querySelector(`#end fieldset input[aria-label="Minutes"]`);
            if (hour.value && !minute.value) {
                minute.value = '00';
                this.shift['time_end'] = {
                    hour: Number(hour.value),
                    minute: 0
                };
            }
        }
    }

}
