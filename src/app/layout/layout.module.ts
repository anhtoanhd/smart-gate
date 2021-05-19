import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {NgbDropdownModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { FormComponent } from './components/form/form.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { AccessRoleComponent } from './components/access-role/access-role.component';
import {ShiftFormComponent} from './components/shift-form/shift-form.component';
import { SettingFormComponent } from './components/setting-form/setting-form.component';
import { StaffShiftFormComponent } from './components/staff-shift-form/staff-shift-form.component';
import {GControlModule} from '../core/g-control/g-control.module';
import {VnitDirectivesModule, VnitValidatorsModule} from 'vnit-utility';
import { CombineBlockComponent } from './components/combine-block/combine-block.component';
import { RestoreDialogComponent } from './components/restore-dialog/restore-dialog.component';
import { ExportOptionComponent } from './components/export-option/export-option.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule,
        NgbDropdownModule,
        NgSelectModule,
        BsDatepickerModule,
        NgbTimepickerModule,
        MatTooltipModule,
        GControlModule,
        VnitDirectivesModule,
        VnitValidatorsModule,
        MatProgressSpinnerModule,
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        ConfirmComponent,
        FormComponent,
        AccessRoleComponent,
        ShiftFormComponent,
        SettingFormComponent,
        StaffShiftFormComponent,
        CombineBlockComponent,
        RestoreDialogComponent,
        ExportOptionComponent
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        ConfirmComponent,
        FormComponent,
        AccessRoleComponent,
        ShiftFormComponent,
        SettingFormComponent,
        StaffShiftFormComponent
    ]
})
export class LayoutModule {}
