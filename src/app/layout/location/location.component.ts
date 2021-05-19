import {Component, OnInit} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import {FormComponent} from '../components/form/form.component';
import {AppConst} from '../../appconst';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    location: any = {};
    itemPerPage = 10;
    listLocation: any = [];
    selectedLocations: any = [];
    key_word = '';
    order = 'is_active';
    direction = 'desc';
    currentPage = 1;
    listEditLocations = [];
    isLoading = false;
    totalPages: number;

    constructor(
        private commonService: CommonService,
        private modalService: NgbModal,
        private dialog: MatDialog,
        private networkService: NetworkService,
    ) {
    }

    ngOnInit() {
        this.loadListLocation(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word);
    }

    loadListLocation(itemPerPage: number, currentPage: number, order: string, direction: string, keyword: string, timeDelay = 500) {
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
        this.networkService.get(AppConst.LOCATION_LIST_API, params, timeDelay).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.totalPages = Number(response.data.last_page);
                    this.listLocation = [...response.data.data];
                    this.listEditLocations = this.listLocation.filter(location => location['is_edit']);
                    if (this.currentPage > 1 && this.listLocation.length === 0) {
                        this.currentPage--;
                        this.setPage(itemPerPage, this.currentPage, order, direction, keyword, timeDelay);
                    }
                }
            },
            error => {
                console.log(error);
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
            },
            () => {
                this.isLoading = false;
            });
    }

    setPage(itemPerPage: number, page: number, order: string, direction: string, keyword: string, timeDelay = 500) {
        this.currentPage = page;
        this.selectedLocations = [];
        this.loadListLocation(itemPerPage, page, order, direction, keyword, timeDelay);
    }

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Location information', 'Confirm warning delete location', 'Confirm note delete location').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    params['disable_user'] = result.disable ? 1 : 0;
                    this.selectedLocations.forEach((location, index) => {
                        params['id[' + index + ']'] = location.id;
                    });
                    this.networkService.delete(AppConst.LOCATION_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                        this.selectedLocations = [];
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

    onOpenFormDialog(locationId, is_edit) {
        if (is_edit) {
            const dialogRef = this.dialog.open(FormComponent, {
                disableClose: true,
                width: '352px',
                data: {
                    formType: 'location',
                    id: locationId
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (typeof result === 'boolean') {
                        if (locationId) {
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

    onLocationCheckedChange(event, location) {
        if (event.target.checked) {
            this.selectedLocations.push(location);
            location.isChecked = true;
        } else {
            this.selectedLocations.splice(this.selectedLocations.indexOf(location, 0), 1);
            location.isChecked = false;
        }
    }

    onSelectAllChange(event) {
        if (event.target.checked) {
            this.selectedLocations = [];
            this.listLocation.forEach(location => {
                if (!location['default']) {
                    location.isChecked = true;
                    this.selectedLocations.push(location);
                }
            });
        } else {
            this.listLocation.forEach(location => {
                location.isChecked = false;
            });
            this.selectedLocations = [];
        }
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
                        this.networkService.post(AppConst.LOCATION_ACTIVE_API + '/' + id, formData).subscribe(
                            response => {
                                if (!response.error_code) {
                                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                                        () => {
                                            this.loadListLocation(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
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

    onSearchInputChange(event) {
        this.key_word = event;
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word);
    }
}
