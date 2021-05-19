import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {GControlModule} from '../../core/g-control/g-control.module';

@NgModule({
  declarations: [LocationComponent],
    imports: [
        CommonModule,
        LocationRoutingModule,
        TranslateModule,
        NgSelectModule,
        FormsModule,
        NgbModule,
        MatProgressSpinnerModule,
        GControlModule
    ]
})
export class LocationModule { }
