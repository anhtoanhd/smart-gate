import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {CommonService, NetworkService} from '../../../shared/services';
import {AppConst} from '../../../appconst';

@Component({
    selector: 'app-staff-shift-form',
    templateUrl: './staff-shift-form.component.html',
    styleUrls: ['./staff-shift-form.component.scss']
})
export class StaffShiftFormComponent implements OnInit {

    area = {};
    shift = {};
    startDate: Date;
    endDate: any;
    editable: boolean;
    formSubmitted: any;
    listOutsideStaff = [];
    selectedStaffs = [];
    listInsideStaff = [];
    removedStaffs = [];
    now = new Date();
    today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    itemPerPage = 10;
    totalItemInside = 0;
    totalItemOutside = 0;
    currentInsidePage = 1;
    currentOutsidePage = 1;
    search = {};
    isEdit: boolean;
    areas = [];
    filter = {};

    constructor(
        public dialogRef: MatDialogRef<StaffShiftFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private networkService: NetworkService,
        public commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.area = {...this.data.area};
        this.shift = {...this.data.shift};
        this.startDate = this.data.startDate;
        this.endDate = this.data.endDate;
        this.editable = this.data.editable;
        if (!this.endDate) {
            this.endDate = this.startDate;
        }
        this.getAreas();
        this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], false);
        this.getStaffInSide(this.currentInsidePage, this.itemPerPage, this.search['inside'], this.filter['inside_area'], false);
    }

    getAreas() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    response.data.forEach(area => {
                        this.areas = [...this.areas, area];
                    });
                }
            },
            error => console.log(error)
        );
    }

    getStaffOutSide(page: number, itemPerPage: number, key_word: string, area_id, isLoadmore: boolean) {
        this.formSubmitted = true;
        const params = {};
        params['area_id'] = this.area['id'];
        params['shift_id'] = this.shift['id'];
        params['start_time'] = `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`;
        params['end_time'] = `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`;
        params['page'] = page;
        params['limit'] = itemPerPage;
        if (key_word) {
            params['key_word'] = key_word;
        }
        if (area_id) {
            params['area_user_id[0]'] = area_id;
        }
        this.networkService.get(AppConst.WORK_CALENDAR_OUTSIDE_STAFF, params).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    if (isLoadmore) {
                        response['data']['users'].forEach(user => {
                            this.listOutsideStaff = [...this.listOutsideStaff, user];
                        });
                    } else {
                        this.listOutsideStaff = [...response['data']['users']];
                        let filterAreaArr;
                        let searchArr;
                        if (area_id) {
                            filterAreaArr = this.removedStaffs.filter(staff => Number(staff.area_id) === Number(area_id));
                        } else {
                            filterAreaArr = [...this.removedStaffs];
                        }
                        searchArr = filterAreaArr.filter(staff => this.commonService.xoa_dau(staff['user_name'].toLowerCase())
                            .includes(this.commonService.xoa_dau(this.search['inside'] ? this.search['inside'].toLowerCase() : '')));
                        this.listOutsideStaff = this.listOutsideStaff.concat(...searchArr);
                        this.listOutsideStaff = Array.from(new Set(this.listOutsideStaff.map(s => s.user_id)))
                           .map(id => {
                               return {
                                   user_id: id,
                                   user_name: this.listOutsideStaff.find(staff => staff.user_id === id).user_name,
                                   user_idNumber: this.listOutsideStaff.find(staff => staff.user_id === id).user_idNumber,
                                   area_id: this.listOutsideStaff.find(staff => staff.user_id === id).area_id,
                                   area_name: this.listOutsideStaff.find(staff => staff.user_id === id).area_name,
                                   department_id: this.listOutsideStaff.find(staff => staff.user_id === id).department_id,
                                   department_name: this.listOutsideStaff.find(staff => staff.user_id === id).department_name
                               };
                           });
                        this.selectedStaffs.forEach(staff => {
                            if (this.listOutsideStaff.indexOf(this.listOutsideStaff.find(s => s.user_id === staff.user_id)) !== -1) {
                                this.listOutsideStaff.splice(this.listOutsideStaff.indexOf(this.listOutsideStaff.find(s => s.user_id === staff.user_id)), 1);
                            }
                        });
                    }
                    this.totalItemOutside = Number(response['data']['total_item']);
                }
            },
            error => console.log(error),
            () => this.formSubmitted = false
        );
    }

    getStaffInSide(page: number, itemPerPage: number, key_word: string, area_id, isLoadmore: boolean) {
        this.formSubmitted = true;
        const params = {};
        params['area_id'] = this.area['id'];
        params['shift_id'] = this.shift['id'];
        params['start_time'] = `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`;
        params['end_time'] = `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`;
        params['page'] = page;
        params['limit'] = itemPerPage;
        if (key_word) {
            params['key_word'] = key_word;
        }
        if (area_id) {
            params['area_user_chosen_id[0]'] = area_id;
        }
        this.networkService.get(AppConst.WORK_CALENDAR_INSIDE_STAFF, params).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    if (isLoadmore) {
                        response['data']['users'].forEach(user => {
                            this.listInsideStaff = [...this.listInsideStaff, user];
                        });
                    } else {
                        this.listInsideStaff = [...response['data']['users']];
                        let filterAreaArr;
                        let searchArr;
                        if (area_id) {
                            filterAreaArr = this.selectedStaffs.filter(staff => Number(staff.area_id) === Number(area_id));
                        } else {
                            filterAreaArr = [...this.selectedStaffs];
                        }
                        searchArr = filterAreaArr.filter(staff => {
                            return this.commonService.xoa_dau(staff['user_name'].toLowerCase())
                                .includes(this.commonService.xoa_dau(this.search['inside'] ? this.search['inside'].toLowerCase() : ''));
                        });
                        this.listInsideStaff = this.listInsideStaff.concat(...searchArr);
                        this.listInsideStaff = Array.from(new Set(this.listInsideStaff.map(s => s.user_id)))
                            .map(id => {
                                return {
                                    user_id: id,
                                    user_name: this.listInsideStaff.find(staff => staff.user_id === id).user_name,
                                    user_idNumber: this.listInsideStaff.find(staff => staff.user_id === id).user_idNumber,
                                    area_id: this.listInsideStaff.find(staff => staff.user_id === id).area_id,
                                    area_name: this.listInsideStaff.find(staff => staff.user_id === id).area_name,
                                    department_id: this.listInsideStaff.find(staff => staff.user_id === id).department_id,
                                    department_name: this.listInsideStaff.find(staff => staff.user_id === id).department_name
                                };
                            });
                        this.removedStaffs.forEach(staff => {
                            if (this.listInsideStaff.indexOf(this.listInsideStaff.find(s => s.user_id === staff.user_id)) !== -1) {
                                this.listInsideStaff.splice(this.listInsideStaff.indexOf(this.listInsideStaff.find(s => s.user_id === staff.user_id)), 1);
                            }
                        });
                    }
                    this.totalItemInside = Number(response['data']['total_item']);
                }
            },
            error => console.log(error),
            () => this.formSubmitted = false
        );
    }

    onCancelClick() {
        this.dialogRef.close('close');
    }

    onSaveClick() {
        this.formSubmitted = true;
        const formData = new FormData();
        formData.set('shift_id', this.shift['id']);
        formData.set('area_id', this.area['id']);
        formData.set('start_time', `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`);
        formData.set('end_time', `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`);
        this.selectedStaffs.forEach((staff, index) => {
            formData.set('addUsers[' + index + ']', staff['user_id']);
        });
        this.removedStaffs.forEach((staff, index) => {
            formData.set('delUsers[' + index + ']', staff['user_id']);
        });
        this.networkService.post(AppConst.WORK_CALENDAR_STORE, formData).subscribe(
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
                console.log(error);
                this.dialogRef.close(false);
            },
            () => {
                this.formSubmitted = false;
            }
        );
    }

    onDatepickerShown(event, datepicker) {
        this.commonService.onDatepickerShown(event, datepicker);
    }

    onLoadMoreInSideStaff() {
        if (this.totalItemInside > this.listInsideStaff.length) {
            this.currentInsidePage++;
            this.getStaffInSide(this.currentInsidePage, this.itemPerPage, this.search['inside'], this.filter['inside_area'], true);
        }
    }

    onLoadMoreOutSideStaff() {
        if (this.totalItemOutside > this.listOutsideStaff.length) {
            this.currentOutsidePage++;
            this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], true);
        }
    }

    onAddStaffClick(staff) {
        this.isEdit = true;
        this.listInsideStaff.push(staff);
        this.selectedStaffs.push(staff);
        this.listOutsideStaff.splice(this.listOutsideStaff.indexOf(this.listOutsideStaff.find(s => s.user_id === staff.user_id)), 1);
        if (this.removedStaffs.indexOf(this.removedStaffs.find(s => s.user_id === staff.user_id)) !== -1) {
            this.removedStaffs.splice(this.removedStaffs.indexOf(this.removedStaffs.find(s => s.user_id === staff.user_id)), 1);
        }
    }

    onRemoveStaffClick(staff) {
        this.isEdit = true;
        this.listOutsideStaff.push(staff);
        this.removedStaffs.push(staff);
        this.listInsideStaff.splice(this.listInsideStaff.indexOf(this.listInsideStaff.find(s => s.user_id === staff.user_id)), 1);
        if (this.selectedStaffs.indexOf(this.selectedStaffs.find(s => s.user_id === staff.user_id)) !== -1) {
            this.selectedStaffs.splice(this.selectedStaffs.indexOf(this.selectedStaffs.find(s => s.user_id === staff.user_id)), 1);
        }
    }

    onSearchOutsideClick() {
        this.currentOutsidePage = 1;
        this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], false);
    }

    onSearchInsideClick() {
        this.currentInsidePage = 1;
        this.getStaffInSide(this.currentInsidePage, this.itemPerPage, this.search['inside'], this.filter['inside_area'], false);
    }

    onEndDateChange(event) {
        this.endDate = event;
        this.currentOutsidePage = 1;
        this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], false);
    }

    onSearchOutsideInput(event) {
        if (!event.target.value) {
            this.currentOutsidePage = 1;
            this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], false);
        }
    }

    onSearchInsideInput(event) {
        if (!event.target.value) {
            this.currentInsidePage = 1;
            this.getStaffInSide(this.currentInsidePage, this.itemPerPage, this.search['inside'], this.filter['inside_area'], false);
        }
    }

    onInsideAreaChange() {
        this.currentInsidePage = 1;
        this.getStaffInSide(this.currentInsidePage, this.itemPerPage, this.search['inside'], this.filter['inside_area'], false);
    }

    onOutsideAreaChange() {
        this.currentOutsidePage = 1;
        this.getStaffOutSide(this.currentOutsidePage, this.itemPerPage, this.search['outside'], this.filter['outside_area'], false);
    }
}
