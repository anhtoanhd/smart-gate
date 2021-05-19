import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShiftRoutingModule} from './shift-routing.module';
import {ShiftComponent} from './shift.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {GControlModule} from '../../core/g-control/g-control.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [ShiftComponent],
    imports: [
        CommonModule,
        ShiftRoutingModule,
        TranslateModule,
        NgSelectModule,
        FormsModule,
        BsDropdownModule,
        GControlModule,
        MatProgressSpinnerModule
    ]
})
export class ShiftModule {
}
