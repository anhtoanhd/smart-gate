import {Component, OnInit} from '@angular/core';
import {AppConst} from '../../appconst';
import {CommonService, NetworkService} from '../../shared/services';
import {MatDialog} from '@angular/material/dialog';
import {FormComponent} from '../components/form/form.component';
import {RestoreDialogComponent} from '../components/restore-dialog/restore-dialog.component';

@Component({
    selector: 'app-device-setup',
    templateUrl: './device-setup.component.html',
    styleUrls: ['./device-setup.component.scss']
})
export class DeviceSetupComponent implements OnInit {
    selectedDevices: any = [];
    listDevice: any = [];
    listLocation = [];
    key_word = '';
    itemPerPage = 10;
    order = '';
    direction = '';
    currentPage: any;
    isSyncClicked = false;
    isLoading = false;
    totalPages: number;

    constructor(
        private networkService: NetworkService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadListLocation();
        this.setPage(this.itemPerPage, 1, this.order, this.direction, this.key_word);
    }

    loadListLocation() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listLocation = response.data ? response.data : [];
                }
            },
            error => {
                console.log(error);
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
            }
        );
    }

    loadListDevice(itemPerPage: number, currentPage: number, order: string, direction: string, keyword: string, timeDelay) {
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
            params['name'] = keyword;
        }
        if (timeDelay) {
            this.isLoading = true;
        }
        this.networkService.get(AppConst.DEVICE_LIST_API, params, timeDelay).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.totalPages = Number(response.data.total_page);
                    this.listDevice = response.data.devices;
                    if (this.currentPage > 1 && this.listDevice.length === 0) {
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
        this.selectedDevices = [];
        this.loadListDevice(itemPerPage, page, order, direction, keyword, timeDelay);
    }

    onOpenFormDialog(id) {
        const dialogRef = this.dialog.open(FormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                formType: 'device',
                id: id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    if (id) {
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

    onDeleteClick() {
        this.commonService.confirmDialog(this.dialog, 'delete',
            'Delete Device information', 'Confirm warning delete device', 'Confirm note delete device').then(
            (result: any) => {
                if (result) {
                    this.isLoading = true;
                    const params = {};
                    this.selectedDevices.forEach((device, index) => {
                        params['id[' + index + ']'] = device.id;
                    });
                    this.networkService.delete(AppConst.DEVICE_DESTROY_API, params).subscribe(
                        response => {
                            if (response && !response.error_code) {
                                this.commonService.confirmDialog(this.dialog, 'success', 'Delete success!', null, null, true, 1000).then(
                                    () => {
                                        this.setPage(this.itemPerPage, this.currentPage, this.order, this.direction, this.key_word, 0);
                                        this.selectedDevices = [];
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

    onSelectAll(event) {
        if (event.target.checked) {
            this.selectedDevices = [];
            this.listDevice.forEach(department => {
                department.isChecked = true;
                this.selectedDevices.push(department);
            });
        } else {
            this.listDevice.forEach(department => {
                department.isChecked = false;
            });
            this.selectedDevices = [];
        }
    }

    onDeviceCheckedChange(event, device) {
        if (event.target.checked) {
            this.selectedDevices.push(device);
            device.isChecked = true;
        } else {
            this.selectedDevices.splice(this.selectedDevices.indexOf(device, 0), 1);
            device.isChecked = false;
        }
    }

    async onSyncClick(id) {
        this.isSyncClicked = true;
        try {
            const formData = new FormData();
            formData.append('id', id);
            const response = await this.networkService.post(AppConst.DEVICE_SYNC_API + id, formData).toPromise();
            if (response && !response.error_code && response.data) {
                this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000);
                this.isSyncClicked = false;
            } else {
                this.commonService.confirmDialog(this.dialog, 'error', response['message'], null, null, true, 1000);
                this.isSyncClicked = false;
            }
        } catch (error) {
            this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
        }
    }


    onRestoreClick(deviceId: any): void {
        const dialogRef = this.dialog.open(RestoreDialogComponent,
            {
                disableClose: true,
                width: '407px',
                data: {
                    id: deviceId
                }
            }
        );
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    if (typeof result === 'boolean') {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Restore data success!', null, null, true, 1000);
                    } else {
                        this.commonService.confirmDialog(this.dialog, 'error', result, null, null, true, 1000);
                    }
                } else if (result !== undefined) {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        );
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
