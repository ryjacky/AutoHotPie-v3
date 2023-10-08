import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SplashScreenComponent} from './splash-screen.component';
import {SplashScreenRoutingModule} from './splash-screen-routing.module';



@NgModule({
  declarations: [SplashScreenComponent],
  imports: [
    SplashScreenRoutingModule,
    CommonModule,
    NgOptimizedImage
  ]
})
export class SplashScreenModule { }
