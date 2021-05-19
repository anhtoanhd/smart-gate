import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkCalendarComponent} from './work-calendar.component';
import {WorkCalendarWizardComponent} from './work-calendar-wizard/work-calendar-wizard.component';

const routes: Routes = [
    { path: '', component: WorkCalendarComponent },
    { path: 'wizard', component: WorkCalendarWizardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCalendarRoutingModule { }
