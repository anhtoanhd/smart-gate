import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService, NetworkService} from '../../shared/services';
import { MatDialog } from '@angular/material/dialog';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, viLocale} from 'ngx-bootstrap/chronos';
import {AppConst} from '../../appconst';
import {ShiftFormComponent} from '../components/shift-form/shift-form.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

    listShift = [];
    selectedShifts = [];
    itemPerPage = 10;
    listDepartment = [];
    order = 'is_activated';
    direction = 'desc';
    listLocation = [];
    listLocationTemp = [];
    filter: any = {};
    currentPage = 1;
    totalPages: number;
    isLoading: any;

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
        this.loadListShift(this.itemPerPage, 1, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
        this.loadAllDepartment();
        this.loadAllArea();
    }

    loadAllArea() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    this.listLocation = [...response.data];
                    this.listLocationTemp = [...response.data];
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    loadAllDepartment() {
        this.networkService.get(AppConst.DEPARTMENT_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listDepartment = response.data;
                }
            },
            error => {
                console.log(error);
            }
        );
    }


    setPage(itemPerPage: number, page: number, order: string, direction: string, keyword: string, areas: any[], delayTime = 500) {
        this.currentPage = page;
        this.selectedShifts = [];
        this.loadListShift(itemPerPage, page, order, direction, keyword, areas, delayTime);
    }

    loadListShift(itemPerPage: number, currentPage: number, order: string,
                  direction: string, keyword: string, areas: any[], delayTime = 500) {
        if (delayTime) {
            this.isLoading = true;
        }
        const params = {};
        params['limit'] = itemPerPage;
        params['page'] = currentPage;

        if (keyword) {
            params['key_word'] = keyword;
        }
        if (areas && areas.length) {
            areas.forEach((area, index) => {
                params['area_id[' + index + ']'] = area.id;
            });
        }
        if (order) {
            params['order'] = order;
        }
        if (direction) {
            params['direction'] = direction;
        }
        this.networkService.get(AppConst.SHIFT_LIST_API, params, delayTime).subscribe(
            response => {
                this.totalPages = Number(response.data.last_page);
                this.listShift = [...response.data.data];
                if (this.currentPage > 1 && this.listShift.length === 0) {
                    this.currentPage--;
                    this.setPage(itemPerPage, this.currentPage, order, direction, keyword, areas,delayTime);
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.isLoading = false;
            });
    }

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Shift', 'Confirm warning delete shift', '').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    this.selectedShifts.forEach((shift, index) => {
                        params['id[' + index + ']'] = shift.id;
                    });
                    this.networkService.delete(AppConst.SHIFT_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage,
                                            this.order, this.direction, this.filter['key_word'], this.filter['areas'], 0);
                                        this.selectedShifts = [];
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

    openFormDialog(shiftId) {
        const dialogRef = this.dialog.open(ShiftFormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                id: shiftId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    if (shiftId) {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                            () => {
                                this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction,
                                    this.filter['key_word'], this.filter['areas'], 0);
                            }
                        );
                    } else {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Create success!', null, null, true, 1000).then(
                            () => {
                                this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction,
                                    this.filter['key_word'], this.filter['areas'], 0);
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

    onShiftCheckedChange(event, staff) {
        if (event.target.checked) {
            this.selectedShifts.push(staff);
            staff.isChecked = true;
        } else {
            this.selectedShifts.splice(this.selectedShifts.indexOf(staff, 0), 1);
            staff.isChecked = false;
        }
    }

    onSelectAll(event) {
        if (event.target.checked) {
            this.selectedShifts = [];
            this.listShift.forEach(staff => {
                staff.isChecked = true;
                this.selectedShifts.push(staff);
            });
        } else {
            this.listShift.forEach(staff => {
                staff.isChecked = false;
            });
            this.selectedShifts = [];
        }
    }

    onKeyFilterChange() {
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
    }

    onActiveClick(is_activated, id) {
        this.commonService.confirmDialog(this.dialog, 'modify',
            'Are you sure', null, null).then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const formData = new FormData();
                    formData.set('id', id);
                    formData.set('is_activated', is_activated ? '0' : '1');
                    this.networkService.post(AppConst.SHIFT_ACTIVE_API + '/' + id, formData).subscribe(
                        response => {
                            if (!response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                    () => {
                                        this.loadListShift(this.itemPerPage, 1, this.order, this.direction, this.filter['key_word'], this.filter['areas'], 0);
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

    onLocationSearch(event) {
        this.listLocation = this.listLocationTemp.filter(location => {
            return this.commonService.xoa_dau(location.name.toLowerCase()).includes(this.commonService.xoa_dau(event.target.value.toLowerCase()));
        });
    }

    onLocationChange(event, area) {
        area.isChecked = !!event.target.checked;
        this.filter['areas'] = [];
        this.listLocation.forEach(lc => {
            if (lc.isChecked) {
                this.filter['areas'].push(lc);
            }
        });
        this.currentPage = 1;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
    }

    onResetFilterClick() {
        this.filter = {};
        this.listLocation.forEach(location => {
            location.isChecked = false;
        });
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
    }

    onSearchInputChange(event) {
        this.filter['key_word'] = event;
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['key_word'], this.filter['areas']);
    }
}
