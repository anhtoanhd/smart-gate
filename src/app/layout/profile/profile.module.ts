import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {GControlModule} from '../../core/g-control/g-control.module';
import {VnitValidatorsModule} from 'vnit-utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        TranslateModule,
        FormsModule,
        NgSelectModule,
        GControlModule,
        VnitValidatorsModule,
        MatProgressSpinnerModule,
    ]
})
export class ProfileModule { }
