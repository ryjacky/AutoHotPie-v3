import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieMenuEditorComponent } from './pie-menu-editor.component';
import {TranslateModule} from '@ngx-translate/core';
import {SettingsTabComponent} from './settings-tab/settings-tab.component';
import {
  NbButtonGroupModule,
  NbButtonModule, NbCardModule, NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule, NbInputModule,
  NbListModule, NbRadioModule,
  NbSelectModule, NbTabsetModule, NbTagModule,
  NbToggleModule
} from '@nebular/theme';
import {RouterLink} from '@angular/router';
import { ActionCardComponent } from './action-card/action-card.component';
import {SharedModule} from '../../shared/shared.module';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import {PieMenuUIModule} from '../../pie-menu-ui/pie-menu-ui.module';
import {NgxColorsModule} from "ngx-colors";

@NgModule({
  declarations: [
    PieMenuEditorComponent,
    SettingsTabComponent,
    ActionCardComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NbListModule,
    NbToggleModule,
    NbButtonModule,
    NbIconModule,
    RouterLink,
    NbSelectModule,
    NbFormFieldModule,
    NbInputModule,
    SharedModule,
    NbButtonGroupModule,
    NbRadioModule,
    NbCheckboxModule,
    NbCardModule,
    NbTabsetModule,
    CdkDropList,
    CdkDrag,
    NbTagModule,
    PieMenuUIModule,
    NgxColorsModule
  ]
})
export class PieMenuEditorModule { }
