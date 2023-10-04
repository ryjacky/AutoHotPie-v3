import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {SplashScreenComponent} from './splash-screen.component';

const routes: Routes = [
  {
    path: 'splash-screen',
    component: SplashScreenComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SplashScreenRoutingModule {}
