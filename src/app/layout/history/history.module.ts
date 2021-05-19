import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {GControlModule} from '../../core/g-control/g-control.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [HistoryComponent],
    imports: [
        CommonModule,
        HistoryRoutingModule,
        FormsModule,
        TranslateModule,
        GControlModule,
        NgSelectModule,
        BsDatepickerModule,
        MatProgressSpinnerModule,
        BsDropdownModule,
    ]
})
export class HistoryModule { }
