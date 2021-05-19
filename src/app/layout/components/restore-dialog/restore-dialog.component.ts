import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppConst} from '../../../appconst';
import {CommonService, NetworkService} from '../../../shared/services';

@Component({
    selector: 'app-restore-dialog',
    templateUrl: './restore-dialog.component.html',
    styleUrls: ['./restore-dialog.component.scss']
})
export class RestoreDialogComponent implements OnInit {

    dateRange = [];

    constructor(
        private networkService: NetworkService,
        private commonService: CommonService,
        private dialogRef: MatDialogRef<RestoreDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
    }

    onFormSubmit(): void {
        const formData = new FormData();
        formData.append('id', this.data.id);
        formData.append('start_date', this.commonService.formatSqlDate(this.dateRange[0]));
        formData.append('end_date', this.commonService.formatSqlDate(this.dateRange[1]));
        this.networkService.post(AppConst.DEVICE_RESTORE_DATA_API, formData).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.dialogRef.close(true);
                } else {
                    this.dialogRef.close(response.message);
                }
            },
            error => {
                this.dialogRef.close(false);
            }
        );
    }

    onCancelClick(): void {
        this.dialogRef.close(undefined);
    }
}
