import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ForgotPasswordComponent],
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        FormsModule,
        TranslateModule,
        MatProgressSpinnerModule
    ]
})
export class ForgotPasswordModule { }
