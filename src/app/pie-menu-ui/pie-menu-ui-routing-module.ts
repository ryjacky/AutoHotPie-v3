import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {PieMenuManagerComponent} from './pie-menu-manager.component';

const routes: Routes = [
  {
    path: 'pieMenuUI',
    component: PieMenuManagerComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PieMenuUIRoutingModule {}
