import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HrReportComponent} from './hr-report.component';

const routes: Routes = [
    {
        path: '',
        component: HrReportComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrReportRoutingModule { }
