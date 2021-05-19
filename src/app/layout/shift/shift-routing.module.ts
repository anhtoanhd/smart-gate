import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShiftComponent} from './shift.component';

const routes: Routes = [
    { path: '', component: ShiftComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRoutingModule { }
