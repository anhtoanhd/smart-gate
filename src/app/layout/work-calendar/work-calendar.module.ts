import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkCalendarRoutingModule } from './work-calendar-routing.module';
import { WorkCalendarComponent } from './work-calendar.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {FullCalendarModule} from '@fullcalendar/angular';
import { WorkCalendarWizardComponent } from './work-calendar-wizard/work-calendar-wizard.component';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {GControlModule} from '../../core/g-control/g-control.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {VnitDirectivesModule} from 'vnit-utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [WorkCalendarComponent, WorkCalendarWizardComponent],
    imports: [
        CommonModule,
        WorkCalendarRoutingModule,
        NgSelectModule,
        FormsModule,
        TranslateModule,
        BsDatepickerModule,
        FullCalendarModule,
        ButtonsModule,
        GControlModule,
        LazyLoadImageModule,
        BsDropdownModule,
        VnitDirectivesModule,
        MatProgressSpinnerModule,
    ]
})
export class WorkCalendarModule { }
