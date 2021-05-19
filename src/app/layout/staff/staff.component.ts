import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../components/form/form.component';
import {AppConst} from '../../appconst';
import {BsDaterangepickerDirective, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {viLocale} from 'ngx-bootstrap/locale';
import {SettingFormComponent} from '../components/setting-form/setting-form.component';
import Swal from 'sweetalert2';
import {forkJoin} from 'rxjs';
import {CombineBlockComponent} from '../components/combine-block/combine-block.component';

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

    @ViewChild('datepicker', {static: false}) private _picker: BsDaterangepickerDirective;
    listStaff = [];
    listIsEditStaff = [];
    selectedStaffs = [];
    itemPerPage = 10;
    listDepartment = [];
    listDepartmentTemp = [];
    listLocation = [];
    listLocationTemp = [];
    order = 'is_activated';
    direction = 'desc';
    currentPage = 1;
    isLoading: any;
    filterType = 'Department';
    isOpenFilterDropdown = false;
    filter = {};
    bsConfig = {
        displayOneMonthRange: true,
        displayMonths: 2,
        selectFromOtherMonth: true,
        showWeekNumbers: false,
    };
    listOffice = [
        {id: 3, name: 'Không thuộc khối nào', value: 'none', isChecked: false},
        {id: 1, name: 'Khối văn phòng', value: 'back_office', isChecked: false},
        {id: 2, name: 'Khối ca kíp', value: 'shift_office', isChecked: false}
    ];
    url = '';
    key_word = '';
    totalPages: number;

    constructor(
        private modalService: NgbModal,
        public commonService: CommonService,
        private dialog: MatDialog,
        private networkService: NetworkService,
        private localeService: BsLocaleService
    ) {
        defineLocale('vi', viLocale);
        localeService.use('vi');
    }

    ngOnInit() {
        this.filter['departments'] = [];
        this.filter['areas'] = [];
        this.loadListStaff(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
        this.loadDepartmentAndArea();
    }

    loadDepartmentAndArea() {
        const departments$ = this.networkService.get(AppConst.DEPARTMENT_ALL_API, {});
        const locations$ = this.networkService.get(AppConst.LOCATION_ALL_API, {});
        forkJoin(departments$, locations$).subscribe(
            result => {
                this.listDepartment = [...result[0].data];
                this.listDepartmentTemp = [...result[0].data];
                this.listLocation = [...result[1].data];
                this.listLocationTemp = [...result[1].data];
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    setPage(itemPerPage: number, page: number, order: string, direction: string, keyword: string,
            departments: any[], areas: any[], worktimes: any[], offices: string, isExport: number, timeDelay = 500) {
        this.currentPage = page;
        this.selectedStaffs = [];
        this.loadListStaff(itemPerPage, page, order, direction, keyword, departments, areas, worktimes, offices, isExport, timeDelay);
    }

    loadListStaff(itemPerPage: number, currentPage: number, order: string,
                  direction: string, keyword: string, departments: any[], areas: any[], worktimes: any[], offices: any, isExport: number, timeDelay = 500) {
        const params = {};
        params['limit'] = itemPerPage;
        params['page'] = currentPage;

        if (keyword) {
            params['key_word'] = keyword;
        }
        if (order) {
            params['order'] = order;
        }
        if (direction) {
            params['direction'] = direction;
        }
        if (departments && departments.length > 0) {
            departments.forEach((dp, index) => {
                params['department_id[' + index + ']'] = dp.id;
            });
        }
        if (areas && areas.length > 0) {
            areas.forEach((area, index) => {
                params['area_id[' + index + ']'] = area.id;
            });
        }
        if (worktimes && worktimes.length > 0) {
            params['work_time[start_time]'] = this.commonService.formatSqlDate(worktimes[0]);
            params['work_time[end_time]'] = this.commonService.formatSqlDate(worktimes[1]);
        }
        if (offices) {
            params['office_type[0]'] = offices['value'];
        }
        params['export_to_excel'] = isExport;
        if (timeDelay) {
            this.isLoading = true;
        }
        this.networkService.get(AppConst.STAFF_LIST_API, params, timeDelay).subscribe(
            response => {
                if (isExport === 0) {
                    this.totalPages = Number(response.data.last_page);
                    this.listStaff = [...response.data.data];
                    this.listIsEditStaff = this.listStaff.filter(staff => staff['is_edit']);
                    if (this.currentPage > 1 && this.listStaff.length === 0) {
                        this.currentPage--;
                        this.setPage(itemPerPage, this.currentPage, order, direction, keyword, departments, areas, worktimes, offices, isExport, timeDelay);
                    }
                } else {
                    this.url = AppConst.HOST_URL + '/' + response.data.path;
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                if (this.url) {
                    const link = document.createElement('a');
                    link.href = this.url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    this.url = '';
                }
                this.isLoading = false;
            });
    }

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Staff information', 'Confirm warning delete staff', 'Confirm note delete staff').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    this.selectedStaffs.forEach((staff, index) => {
                        params['id[' + index + ']'] = staff.id;
                    });
                    this.networkService.delete(AppConst.STAFF_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage,
                                            this.order, this.direction, this.key_word, this.filter['departments'],
                                            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0, 0);
                                        this.selectedStaffs = [];
                                    }
                                );
                            } else {
                                this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
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
        );
    }

    openFormDialog(staffId) {
        const dialogRef = this.dialog.open(FormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                formType: 'staff',
                id: staffId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    if (staffId) {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                            () => {
                                this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
                                    this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0, 0);
                            }
                        );
                    } else {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Create success!', null, null, true, 1000).then(
                            () => {
                                this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
                                    this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0, 0);
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

    onStaffCheckedChange(event, staff) {
        if (event.target.checked) {
            this.selectedStaffs.push(staff);
            staff.isChecked = true;
        } else {
            this.selectedStaffs.splice(this.selectedStaffs.indexOf(staff, 0), 1);
            staff.isChecked = false;
        }
    }

    onSelectAll(event) {
        if (event.target.checked) {
            this.selectedStaffs = [];
            this.listStaff.forEach(staff => {
                if (staff['is_edit']) {
                    staff.isChecked = true;
                    this.selectedStaffs.push(staff);
                }
            });
        } else {
            this.listStaff.forEach(staff => {
                staff.isChecked = false;
            });
            this.selectedStaffs = [];
        }
    }

    onExportClick() {
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 1);
    }

    onAdvancedSettingClick() {
        const dialogRef = this.dialog.open(SettingFormComponent, {
            disableClose: true,
            width: '623px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    // this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
                    //     this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000);
                }
            } else {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        });
    }

    onImportChange(event) {
        if (event.target.files && event.target.files[0]) {
            this.isLoading = true;
            const formData = new FormData();
            formData.set('import_file', event.target.files[0]);
            this.networkService.post(AppConst.IMPORT_USER_API, formData).subscribe(
                response => {
                    const success = response['data']['success'];
                    const fail = response['data']['fail'];
                    const path = response['data']['path'];
                    if (response && !response.error_code) {
                        Swal.fire({
                            icon: 'success',
                            title: `Thành công: ${success} nhân viên`,
                            text: `Thất bại: ${fail} nhân viên`,
                            footer: path ? `<a href="${AppConst.HOST_URL + '/' + path}" target="_blank">Click to download log file</a>` : ''
                        }).then(
                            () => {
                                this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word, this.filter['departments'],
                                    this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0, 0);
                            }
                        );
                        (<HTMLInputElement>document.getElementById('import')).value = null;
                    } else {
                        this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
                        (<HTMLInputElement>document.getElementById('import')).value = null;
                    }
                },
                error => {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                    (<HTMLInputElement>document.getElementById('import')).value = null;
                },
                () => {
                    this.isLoading = false;
                }
            );
        }
    }

    onActiveClick(is_activated, id, is_edit, avatar) {
        if (is_edit && avatar) {
            this.commonService.confirmDialog(this.dialog, 'modify',
                'Are you sure', null, null).then(
                (result: any) => {
                    if (result) {
                        const formData = new FormData();
                        formData.set('id', id);
                        formData.set('is_activated', is_activated ? '0' : '1');
                        this.networkService.post(AppConst.STAFF_ACTIVE_API + '/' + id, formData).subscribe(
                            response => {
                                if (!response.error_code) {
                                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                        () => {
                                            this.loadListStaff(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word,
                                                this.filter['departments'], this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
                                        }
                                    );
                                } else {
                                    this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
                                }
                            },
                            error => {
                                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                                console.log(error);
                            }
                        );
                    }
                }
            );
        }
    }

    onDepartmentSearch(event) {
        this.listDepartment = this.listDepartmentTemp.filter(department => {
            return this.commonService.xoa_dau(department.name.toLowerCase()).includes(this.commonService.xoa_dau(event.target.value.toLowerCase()));
        });
    }

    onDepartmentChange(event, department) {
        department.isChecked = !!event.target.checked;
        this.filter['departments'] = [];
        this.listDepartment.forEach(dp => {
            if (dp.isChecked) {
                this.filter['departments'].push(dp);
            }
        });
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onLocationSearch(event) {
        this.listLocation = this.listLocationTemp.filter(location => {
            return this.commonService.xoa_dau(location.name.toLowerCase()).includes(this.commonService.xoa_dau(event.target.value.toLowerCase()));
        });
    }

    onLocationChange(event, location) {
        location.isChecked = !!event.target.checked;
        this.filter['areas'] = [];
        this.listLocation.forEach(lc => {
            if (lc.isChecked) {
                this.filter['areas'].push(lc);
            }
        });
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onOfficeChange(event, office) {
        office.isChecked = !!event.target.checked;
        this.filter['offices'] = office;
        this.listOffice.forEach(off => {
            if (off.id !== office.id) {
                off.isChecked = false;
            }
        });
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onClearFilterClick() {
        this.isOpenFilterDropdown = false;
        this.filterType = 'Department';
        this.filter['departments'] = [];
        this.listDepartment.forEach(department => {
            department.isChecked = false;
        });
        this.filter['areas'] = [];
        this.listLocation.forEach(area => {
            area.isChecked = false;
        });
        this.filter['date_range'] = null;
        this.filter['offices'] = [];
        this.listOffice.forEach(office => {
            office.isChecked = false;
        });
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onChooseDateRange(event) {
        if (event.length) {
            this.currentPage = 1;
            this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
                this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
        }
    }

    onResetFilterClick() {
        this.filter = {};
        this.listDepartment.forEach(department => {
            department.isChecked = false;
        });
        this.listLocation.forEach(location => {
            location.isChecked = false;
        });
        this.listOffice.forEach(office => {
            office.isChecked = false;
        });
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onSearchInputChange(event) {
        this.key_word = event;
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, this.filter['departments'],
            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0);
    }

    onDownloadClick() {
        window.open(AppConst.HOST_URL + '/static/exports/template-import/file_mau_import_users_excel.xlsx', '_blank');
    }

    onCombineClick() {
        const dialogRef = this.dialog.open(CombineBlockComponent, {
            disableClose: true,
            width: '352px'
        });

        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.isLoading = true;
                    const formData = new FormData();
                    formData.set('office_type', result.block);
                    if (result.shifts.length) {
                        result.shifts.forEach((id, index) => {
                            formData.set('list_work_time_ranges_id[' + index + ']', id);
                        });
                    }
                    if (this.selectedStaffs.length) {
                        this.selectedStaffs.forEach((staff, index) => {
                            formData.set('id[' + index + ']', staff.id);
                        });
                    }
                    this.networkService.post(AppConst.STAFF_UPDATE_WORK_SHIFT_API, formData).subscribe(
                        response => {
                            if (!response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage,
                                            this.order, this.direction, this.key_word, this.filter['departments'],
                                            this.filter['areas'], this.filter['date_range'], this.filter['offices'], 0, 0);
                                    }
                                );
                            } else {
                                this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
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
        );
    }
}
