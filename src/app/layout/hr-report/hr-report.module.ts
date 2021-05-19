import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { HrReportRoutingModule } from './hr-report-routing.module';
import { HrReportComponent } from './hr-report.component';
import {TranslateModule} from '@ngx-translate/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {GControlModule} from '../../core/g-control/g-control.module';
import {LayoutModule} from '../layout.module';

@NgModule({
  declarations: [HrReportComponent],
    imports: [
        CommonModule,
        HrReportRoutingModule,
        TranslateModule,
        BsDropdownModule,
        FormsModule,
        ButtonsModule,
        BsDatepickerModule,
        DragDropModule,
        NgbModule,
        MatTooltipModule,
        GControlModule,
        MatProgressSpinnerModule,
        LayoutModule
    ]
})
export class HrReportModule { }
