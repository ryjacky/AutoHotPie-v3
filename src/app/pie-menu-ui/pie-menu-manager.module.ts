import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PieMenuManagerComponent} from './pie-menu-manager.component';
import {NbButtonModule, NbIconModule, NbLayoutModule} from '@nebular/theme';
import {RouterOutlet} from '@angular/router';
import {PieMenuUIRoutingModule} from './pie-menu-ui-routing-module';
import { PieGuidingLineComponent } from './pie-guiding-line/pie-guiding-line.component';
import {SharedModule} from '../shared/shared.module';
import { PieMenuComponent } from './pie-menu/pie-menu.component';

@NgModule({
  declarations: [
    PieMenuManagerComponent,
    PieGuidingLineComponent,
    PieMenuComponent,
  ],
  exports: [
    PieMenuManagerComponent,
  ],
    imports: [
        CommonModule,
        NbLayoutModule,
        PieMenuUIRoutingModule,
        NbButtonModule,
        RouterOutlet,
        SharedModule,
        NbIconModule
    ]
})
export class PieMenuManagerModule { }
