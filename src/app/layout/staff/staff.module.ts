import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {GControlModule} from '../../core/g-control/g-control.module';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [StaffComponent],
    imports: [
        CommonModule,
        StaffRoutingModule,
        TranslateModule,
        ButtonsModule,
        FormsModule,
        NgbModule,
        NgSelectModule,
        BsDatepickerModule,
        MatProgressSpinnerModule,
        GControlModule,
        BsDropdownModule
    ]
})
export class StaffModule { }
