import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {AppConst} from '../../../appconst';
import {CommonService, NetworkService} from '../../../shared/services';

@Component({
    selector: 'app-combine-block',
    templateUrl: './combine-block.component.html',
    styleUrls: ['./combine-block.component.scss']
})
export class CombineBlockComponent implements OnInit {
    officeType = 'back_office';
    shifts = [];
    resErrors: any = {};
    listSelectedShift = [];

    constructor(
        private dialogRef: MatDialogRef<CombineBlockComponent>,
        private networkService: NetworkService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.loadListShift();
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

    onFormSubmit() {
        this.dialogRef.close({block: this.officeType, shifts: this.listSelectedShift});
    }

    onOfficeChange(event) {
        if (event.target.checked) {
            this.listSelectedShift = [];
        }
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }
}
