import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-export-option',
    templateUrl: './export-option.component.html',
    styleUrls: ['./export-option.component.scss']
})
export class ExportOptionComponent implements OnInit {

    fileType = 'list';

    constructor(
        private dialogRef: MatDialogRef<ExportOptionComponent>
    ) {
    }

    ngOnInit(): void {
    }

    onFormSubmit() {
        this.dialogRef.close(this.fileType);
    }

    onCancelClick() {
        this.dialogRef.close();
    }
}
