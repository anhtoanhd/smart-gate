import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import {TranslateModule} from '@ngx-translate/core';
import { ChartComponent } from './components/chart/chart.component';
import { TopCardComponent } from './components/top-card/top-card.component';
import {ChartsModule} from 'ng2-charts';
import { TodayTableComponent } from './components/today-table/today-table.component';
import { DepartmentCardComponent } from './components/department-card/department-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [OverviewComponent, ChartComponent, TopCardComponent, TodayTableComponent, DepartmentCardComponent],
    imports: [
        CommonModule,
        OverviewRoutingModule,
        TranslateModule,
        ChartsModule,
        MatTooltipModule,
        NgSelectModule,
        FormsModule,
        MatProgressSpinnerModule
    ]
})
export class OverviewModule { }
