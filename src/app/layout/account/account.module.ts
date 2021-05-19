import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import {LayoutModule} from '../layout.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {GControlModule} from '../../core/g-control/g-control.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [AccountComponent],
    imports: [
        CommonModule,
        AccountRoutingModule,
        LayoutModule,
        TranslateModule,
        FormsModule,
        GControlModule,
        MatProgressSpinnerModule
    ]
})
export class AccountModule { }
