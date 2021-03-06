import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DeviceSetupComponent} from './device-setup.component';

const routes: Routes = [
    {
        path: '',
        component: DeviceSetupComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceSetupRoutingModule { }
