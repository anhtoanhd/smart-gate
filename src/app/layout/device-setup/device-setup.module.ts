import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceSetupRoutingModule } from './device-setup-routing.module';
import { DeviceSetupComponent } from './device-setup.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {GControlModule} from '../../core/g-control/g-control.module';

@NgModule({
  declarations: [DeviceSetupComponent],
    imports: [
        CommonModule,
        DeviceSetupRoutingModule,
        TranslateModule,
        FormsModule,
        MatProgressSpinnerModule,
        GControlModule
    ]
})
export class DeviceSetupModule { }
