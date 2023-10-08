import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components';

import {HomeRoutingModule} from './editor/home/home-routing.module';

import {PieMenuEditorModule} from './editor/pie-menu-editor/pie-menu-editor.module';
import {SettingsComponent} from './editor/settings/settings.component';
import {SettingsModule} from './editor/settings/settings.module';
import {PieMenuEditorRoutingModule} from './editor/pie-menu-editor/pie-menu-editor-routing.module';
import {PieMenuUIRoutingModule} from './pie-menu-ui/pie-menu-ui-routing-module';
import {SplashScreenRoutingModule} from './splash-screen/splash-screen-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    HomeRoutingModule,
    PieMenuEditorRoutingModule,
    PieMenuUIRoutingModule,
    SettingsModule,
    SplashScreenRoutingModule,
    // The following must be kept, otherwise the app will not work (I have no idea why)
    PieMenuEditorModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
