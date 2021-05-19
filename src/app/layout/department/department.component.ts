import {Component, OnInit} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../components/form/form.component';
import {AppConst} from '../../appconst';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

    listDepartment: any = [];
    selectedDepartments: any = [];
    itemPerPage = 10;
    key_word = '';
    order = 'is_active';
    direction = 'desc';
    currentPage = 1;
    listEditDepartment = [];
    isLoading = false;
    totalPages: number;

    constructor(
        private commonService: CommonService,
        private modalService: NgbModal,
        private dialog: MatDialog,
        private networkService: NetworkService

    ) {
    }

    ngOnInit() {
        this.loadListDepartment(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    loadListDepartment(itemPerPage: number, currentPage: number, order: string, direction: string, keyword: string, timeDelay = 500) {
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
        if (timeDelay) {
            this.isLoading = true;
        }
        this.networkService.get(AppConst.DEPARTMENT_LIST_API, params, timeDelay).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.totalPages = Number(response.data.total_page);
                    this.listDepartment = [...response.data.departments];
                    this.listEditDepartment = this.listDepartment.filter(department => department['is_edit']);
                    if (this.currentPage > 1 && this.listDepartment.length === 0) {
                        this.currentPage--;
                        this.setPage(itemPerPage, this.currentPage, order, direction, keyword);
                    }
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'success', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                this.isLoading = false;
            });
    }

    setPage(itemPerPage: number, page: number, order: string, direction: string, keyword: string, timeDelay = 500) {
        this.currentPage = page;
        this.selectedDepartments = [];
        this.loadListDepartment(itemPerPage, page, order, direction, keyword, timeDelay);
    }

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Department information', 'Confirm warning delete department', 'Confirm note delete department').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    params['disable_user'] = result.disable ? 1 : 0;
                    this.selectedDepartments.forEach((department, index) => {
                        params['id[' + index + ']'] = department.id;
                    });
                    this.networkService.delete(AppConst.DEPARTMENT_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                        this.selectedDepartments = [];
                                    }
                                );
                            } else {
                                this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
                            }
                        },
                        error => {
                            this.commonService.confirmDialog(this.dialog, 'error', 'System success!', null, null, true, 1000);
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

    onOpenFormDialog(departmentId, isEdit) {
        if (isEdit) {
            const dialogRef = this.dialog.open(FormComponent, {
                disableClose: true,
                width: '352px',
                data: {
                    formType: 'department',
                    id: departmentId
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (typeof result === 'boolean') {
                        if (departmentId) {
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

    onDepartmentCheckedChange(event, department) {
        if (event.target.checked) {
            this.selectedDepartments.push(department);
            department.isChecked = true;
        } else {
            this.selectedDepartments.splice(this.selectedDepartments.indexOf(department, 0), 1);
            department.isChecked = false;
        }
    }

    onSelectAll(event) {
        if (event.target.checked) {
            this.selectedDepartments = [];
            this.listDepartment.forEach(department => {
                if (!department['default']) {
                    department.isChecked = true;
                    this.selectedDepartments.push(department);
                }
            });
        } else {
            this.listDepartment.forEach(department => {
                department.isChecked = false;
            });
            this.selectedDepartments = [];
        }
    }

    onSearchClick() {
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    onActiveClick(is_active, id, is_edit) {
        if (is_edit) {
            this.commonService.confirmDialog(this.dialog, 'modify',
                'Are you sure', null, null).then(
                (result: any) => {
                    if (result) {
                        this.isLoading = true;
                        const formData = new FormData();
                        formData.set('id', id);
                        formData.set('is_active', is_active ? '0' : '1');
                        this.networkService.post(AppConst.DEPARTMENT_ACTIVE_API + '/' + id, formData).subscribe(
                            response => {
                                if (!response.error_code) {
                                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                        () => {
                                            this.loadListDepartment(this.itemPerPage, 1, this.order, this.direction, this.key_word, 0);
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

    onSearchInput(event) {
        this.key_word = event;
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word);
    }
}
