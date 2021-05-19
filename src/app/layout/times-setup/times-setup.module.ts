import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesSetupRoutingModule } from './times-setup-routing.module';
import { TimesSetupComponent } from './times-setup.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {GControlModule} from '../../core/g-control/g-control.module';
import {VnitValidatorsModule} from 'vnit-utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [TimesSetupComponent],
    imports: [
        CommonModule,
        TimesSetupRoutingModule,
        TranslateModule,
        FormsModule,
        NgSelectModule,
        NgbTimepickerModule,
        GControlModule,
        VnitValidatorsModule,
        MatProgressSpinnerModule,
    ]
})
export class TimesSetupModule { }
