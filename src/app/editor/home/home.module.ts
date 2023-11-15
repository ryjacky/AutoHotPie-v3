import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {SharedModule} from '../../shared/shared.module';
import {
  NbButtonModule,
  NbCardModule, NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule, NbListModule, NbPopoverModule, NbSelectModule, NbSidebarModule, NbToggleModule, NbTooltipModule
} from '@nebular/theme';
import {ProfileBoxComponent} from './profile-box/profile-box.component';
import {PieMenuListComponent} from './pie-menu-list/pie-menu-list.component';
import {NgxColorsModule} from 'ngx-colors';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { PieMenuListRowComponent } from './pie-menu-list/pie-menu-list-row/pie-menu-list-row.component';
import { SelectExeDialogComponent } from './new-profile-dialog/select-exe-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileBoxComponent,
    PieMenuListComponent,
    ProfileEditorComponent,
    PieMenuListRowComponent,
    SelectExeDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    NbButtonModule,
    NbLayoutModule,
    NgOptimizedImage,
    NbInputModule,
    NbIconModule,
    NbFormFieldModule,
    NgxColorsModule,
    NbCardModule,
    NbPopoverModule,
    NbSelectModule,
    NbToggleModule,
    NbDialogModule.forChild({}),
    NbTooltipModule,
    NbListModule,
    NbSidebarModule
  ]
})
export class HomeModule {
}
