import {Component, DoCheck, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {CommonService, NetworkService} from '../../../shared/services';
import {AppConst} from '../../../appconst';
import {BsDatepickerDirective, BsLocaleService} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    @ViewChild('datepicker', {static: false}) private _picker: BsDatepickerDirective;
    formType: any;
    id: any;
    staff: any = {};
    department: any = {};
    location: any = {};
    genders = [{id: 1, name: 'Nữ'}, {id: 0, name: 'Nam'}];
    languages = [{id: 'vi', name: 'Tiếng Việt'}, {id: 'en', name: 'English'}];
    shifts = [];
    departments = [];
    roles = [];
    locations = [];
    isLoading = false;
    account: any = {};
    resErrors: any = {};
    staff_code: any;
    staffs: any;
    inOutRoles = [{id: -1, name: 'Mặc định'}];
    device: any = {};
    deviceTypes = [{id: 1, name: 'Checkin'}, {id: 2, name: 'Checkout'}, {id: 3, name: 'Checkin/Checkout'}];
    vnNameNumberPattern = AppConst.VN_NAME_NUMBER_PATTERN;
    codePattern = AppConst.CODE_PATTERN;
    phonePattern = AppConst.PHONE_PATTERN;
    emailPattern = AppConst.EMAIL_PATTERN;
    passwordPattern = AppConst.PASSWORD_PATTERN;
    hasEmail: boolean;

    constructor(
        public dialogRef: MatDialogRef<FormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private networkService: NetworkService,
        private localeService: BsLocaleService,
        private commonService: CommonService,
        private dialog: MatDialog,
    ) {
        defineLocale('vi', viLocale);
        localeService.use('vi');
    }

    ngOnInit() {
        this.formType = this.data.formType;
        this.id = this.data.id;
        if (this.id !== 0) {
            this.loadDetail(this.id);
        }
        if (this.formType === 'staff') {
            this.staff['office_type'] = 'back_office';
            this.loadListShift();
            this.loadListDepartment();
            this.loadListLocation();
        }
        if (this.formType === 'account') {
            this.loadListRole();
            this.loadListStaff();
        }
        if (this.formType === 'device') {
            this.loadListLocation();
        }
        this.staff.avatar = '../assets/images/content/ic-camera.svg';
        this.staff.birthday = new Date(2000, 0, 1);
        this.staff.start = new Date();
        this.location.shift = 1;
        this.location.limit_access = -1;
        this.department.shift = 1;
    }

    loadListDepartment() {
        this.networkService.get(AppConst.DEPARTMENT_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    response.data.forEach(department => {
                        this.departments = [...this.departments, {id: department.id, name: department.name}];
                    });
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
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
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    loadListShift() {
        this.networkService.get(AppConst.WORKTIME_RANGE_NEW_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response['data']) {
                    response['data'].forEach(data => {
                        this.shifts = [...this.shifts, {id: data.id, name: data.name}];
                    });
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    loadListRole() {
        this.networkService.get(AppConst.ROLE_LIST_API, {}).subscribe(
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

    loadListStaff() {
        const params = {};
        params['is_activated'] = 1;
        this.networkService.get(AppConst.STAFF_SHOW_BY_CODE_API, params).subscribe(
            response => {
                if (response && !response.error_code && response.data.length) {
                    this.staffs = [];
                    response.data.forEach(e => {
                        this.staffs = [...this.staffs, {id: e.id_number, name: `${e.name} (${e.id_number})`}];
                    });
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    loadDetail(id: any) {
        this.isLoading = true;
        if (this.formType === 'department') {
            this.networkService.get(AppConst.DEPARTMENT_SHOW_API + '/' + id, {}).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.department = response.data;
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
        }
        if (this.formType === 'location') {
            this.networkService.get(AppConst.LOCATION_SHOW_API + '/' + id, {}).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.location = response.data;
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
        }
        if (this.formType === 'staff') {
            this.networkService.get(AppConst.STAFF_SHOW_API + '/' + id, {}).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.staff = response.data;
                        this.staff.birthday = response.data.birthday ? new Date(response.data.birthday.replace(/-/g, '/')) : null;
                        this.staff.start = response.data.date_start_at ? new Date(response.data.date_start_at.replace(/-/g, '/')) : null;
                        this.staff.end = response.data.date_end_at ? new Date(response.data.date_end_at.replace(/-/g, '/')) : null;
                        this.staff.gender = Number(response.data.gender);

                        this.networkService.get(AppConst.WORKTIME_RANGE_NEW_API, {}).subscribe(
                            res => {
                                if (res && !res.error_code && res['data']) {
                                    this.staff['list_work_time_ranges_id'] = response.data['list_work_time_ranges_id'].map(value => Number(value));
                                    this.staff['list_work_time_ranges_id'] = this.staff['list_work_time_ranges_id'].filter(value => {
                                        if (res['data'].find(shift => shift.id === value)) {
                                            return value;
                                        }
                                    });
                                }
                            }
                        );
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
        }
        if (this.formType === 'account') {
            this.networkService.get(AppConst.ACCOUNT_SHOW_API + '/' + id, {}).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.account = response.data;
                        this.hasEmail = !!this.account.email;
                        this.staff_code = response.data.id_number;
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
        }
        if (this.formType === 'device') {
            this.networkService.get(AppConst.DEVICE_SHOW_API + '/' + id, {}).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.device = response.data;
                        this.device.is_temp = response.data.is_temp === 1 ? '1' : '0';
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
        }
    }

    onCancelClick() {
        this.dialogRef.close('close');
    }

    onStaffFormSubmit() {
        this.isLoading = true;
        if (this.staff.start && this.staff.end) {
            if (this.staff.start.getTime() >= this.staff.end.getTime()) {
                this.resErrors['end_date'] = ['Ngày kết thúc phải lớn hơn ngày bắt đầu'];
                this.isLoading = false;
                return;
            }
        }

        const formData = new FormData();
        formData.set('name', this.staff.name.trim());
        if (this.staff.id_number) {
            formData.set('id_number', this.staff.id_number.trim());
        }
        formData.set('gender', this.staff.gender !== undefined ? this.staff.gender : '');
        formData.set('telephone', this.staff.telephone ? this.staff.telephone.trim() : '');
        let birth = '';
        if (this.staff.birthday) {
            birth =
                `${this.staff.birthday.getFullYear()}-${this.staff.birthday.getMonth() + 1}-${this.staff.birthday.getDate()}`;
        }
        formData.set('birthday', this.staff.birthday ? birth : '');
        formData.set('locale', this.staff.locale ? this.staff.locale : '');
        if (this.staff.email) {
            formData.set('email', this.staff.email.trim());
        }
        formData.set('department_id', this.staff.department_id ? this.staff.department_id : '');
        formData.set('area_id', this.staff.area_id ? this.staff.area_id : '');
        formData.set('user_position', this.staff.user_position ? this.staff.user_position.trim() : '');
        formData.set('profile_image', this.staff.profile_image ? this.staff.profile_image : '');
        formData.set('date_start_at', this.staff.start ?
            `${this.staff.start.getFullYear()}-${this.staff.start.getMonth() + 1}-${this.staff.start.getDate()}` : '');
        formData.set('date_end_at', this.staff.end ?
            `${this.staff.end.getFullYear()}-${this.staff.end.getMonth() + 1}-${this.staff.end.getDate()}` : '');
        formData.set('office_type', this.staff['office_type']);
        this.staff['list_work_time_ranges_id'].forEach((work_time_id, index) => {
            formData.set('list_work_time_ranges_id[' + index + ']', work_time_id);
        });
        if (this.staff.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.staff.id);
            formData.set('is_activated', this.staff.is_activated ? '1' : '0');
            this.networkService.post(AppConst.STAFF_UPDATE_API + '/' + this.staff.id, formData).subscribe(
                response => {
                    if (response && !response.error_code && !response.error) {
                        this.dialogRef.close(true);
                    } else {
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
                    this.isLoading = false;
                }
            );
        } else {
            this.networkService.post(AppConst.STAFF_STORE_API, formData).subscribe(
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
                    this.isLoading = false;
                }
            );
        }
    }

    onDepartmentFormSubmit() {
        this.isLoading = true;
        const formData = new FormData();
        formData.set('name', this.department.name.trim());
        formData.set('department_code', this.department.department_code ? this.department.department_code : '');
        formData.set('description', this.department.description ? this.department.description : '');
        formData.set('is_active', this.department.is_active ? '1' : '0');
        if (this.department.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.department.id);
            this.networkService.post(AppConst.DEPARTMENT_UPDATE_API + '/' + this.department.id, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        }  else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        } else {
            this.networkService.post(AppConst.DEPARTMENT_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onLocationFormSubmit() {
        this.isLoading = true;
        const formData = new FormData();
        formData.set('name', this.location.name.trim());
        formData.set('area_code', this.location.area_code ? this.location.area_code : '');
        formData.set('description', this.location.description ? this.location.description : '');
        formData.set('is_active', this.location.is_active ? '1' : '0');
        formData.set('limit_access', this.location.limit_access !== undefined ? this.location.limit_access : '0');
        if (this.location.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.location.id);
            this.networkService.post(AppConst.LOCATION_UPDATE_API + '/' + this.location.id, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        } else {
            this.networkService.post(AppConst.LOCATION_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onAvatarChange(event) {
        if (event.target.files && event.target.files[0]) {
            this.staff.profile_image = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => this.staff.avatar = e.target.result;
            reader.readAsDataURL(this.staff.profile_image);
        }
    }

    onAccountFormSubmit() {
        this.isLoading = true;
        const formData = new FormData();
        formData.set('from_user_id', this.account.id);
        formData.set('name', this.account.name.trim());
        formData.set('email', this.account.email.trim());
        formData.set('username', this.account.username.trim());
        formData.set('password', this.account.password ? this.account.password : '');
        formData.set('role_id', this.account.role_id);
        if (this.account.password) {
            formData.set('is_send_email', '1');
        } else {
            formData.set('is_send_email', '0');
        }

        if (this.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.account.id);
            this.networkService.post(AppConst.ACCOUNT_UPDATE_API + '/' + this.account.id, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        } else {
            this.networkService.post(AppConst.ACCOUNT_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onStaffIdKeyUp() {
        this.resErrors = {};
    }

    onDeviceFormSubmit() {
        this.isLoading = true;
        const formData = new FormData();
        formData.set('facesluice_id', this.device.facesluice_id.trim());
        formData.set('facesluice_name', this.device.facesluice_name.trim());
        formData.set('cloud_address', this.device.cloud_address.trim());
        formData.set('cloud_topic', this.device.cloud_topic);
        formData.set('is_active', '1');
        formData.set('area_id', this.device.area_id);
        formData.set('device_type', this.device.device_type);
        formData.set('is_temp', this.device.is_temp);
        // formData.set('time_zone', this.device.time_zone);
        // formData.set('time', this.device.time);

        if (this.device.id) {
            formData.set('_method', 'PUT');
            formData.set('id', this.device.id);
            this.networkService.post(AppConst.DEVICE_UPDATE_API + '/' + this.device.id, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        } else {
            this.networkService.post(AppConst.DEVICE_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.dialogRef.close(true);
                    } else {
                        if (response.error_code === 2) {
                            this.resErrors = response.field;
                        } else if (response.error_code === 5) {
                            this.dialogRef.close('close');
                        } else {
                            this.dialogRef.close(undefined);
                        }
                    }
                },
                error => {
                    this.dialogRef.close(false);
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onStaffChange() {
            if (this.staff_code) {
                const params = {};
                params['id_number'] = this.staff_code;
                params['is_activated'] = 1;
                this.networkService.get(AppConst.STAFF_SHOW_BY_CODE_API, params).subscribe(
                    response => {
                        if (response && !response.error_code && response.data.length) {
                            this.account = response.data[0];
                            this.hasEmail = !!this.account.email;
                        }
                    },
                    error => {
                        this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                        console.log(error);
                    }
                );
            } else {
                this.account = {};
            }
    }

    onEndDateChange() {
        if (this.staff.start) {
            if (this.staff.start.getTime() > this.staff.end.getTime()) {
                this.resErrors['end_date'] = ['Ngày kết thúc phải lớn hơn ngày bắt đầu'];
            } else {
                this.resErrors['end_date'] = [];
            }
        }
    }

    onDatepickerShown(event, datepicker: BsDatepickerDirective) {
        const dayHoverHandler = event.dayHoverHandler;
        event.dayHoverHandler = (hoverEvent) => {
            const {cell, isHovered} = hoverEvent;

            if ((isHovered &&
                !!navigator.platform &&
                /iPad|iPhone|iPod/.test(navigator.platform)) &&
                'ontouchstart' in window
            ) {
                (datepicker as any)._datepickerRef.instance.daySelectHandler(cell);
            }

            return dayHoverHandler(hoverEvent);
        };
    }

    onOfficeChange(event) {
        if (event.target.checked) {
            this.staff['list_work_time_ranges_id'] = [];
        }
    }

    onFieldInput(key: string) {
        this.resErrors[key] = [];
    }
}
