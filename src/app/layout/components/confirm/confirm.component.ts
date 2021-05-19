import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

    type: string;
    title: string;
    notification: string;
    note: string;
    autoClose: boolean;
    autoCloseTime: number;

    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.type = this.data.type;
        this.title = this.data.title;
        this.notification = this.data.notification;
        this.note = this.data.note;
        this.autoClose = this.data.autoClose;
        this.autoCloseTime = this.data.autoCloseTime;

        if (this.type === 'success' || this.type === 'error') {
            if (this.autoClose) {
                setTimeout(() => {
                    this.onCloseDialog(false);
                }, this.autoCloseTime);
            }
        }
    }

    onCloseDialog(value) {
        this.dialogRef.close(value);
    }
}
