import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {GControlModule} from '../../core/g-control/g-control.module';

@NgModule({
  declarations: [DepartmentComponent],
    imports: [
        CommonModule,
        DepartmentRoutingModule,
        TranslateModule,
        FormsModule,
        NgbModule,
        NgSelectModule,
        MatProgressSpinnerModule,
        GControlModule
    ]
})
export class DepartmentModule { }
