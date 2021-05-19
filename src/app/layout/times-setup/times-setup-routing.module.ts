import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesSetupComponent} from './times-setup.component';

const routes: Routes = [
    {
        path: '',
        component: TimesSetupComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesSetupRoutingModule { }
