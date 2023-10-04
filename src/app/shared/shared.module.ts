import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule} from '@angular/forms';
import {ShortcutInputComponent} from './components/shortcut-input/shortcut-input.component';
import {NbButtonModule, NbIconModule, NbInputModule, NbPopoverModule} from '@nebular/theme';
import {PieButtonsComponent} from './components/pie-buttons/pie-buttons.component';
import {TitlebarComponent} from './components/titlebar/titlebar.component';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ShortcutInputComponent, PieButtonsComponent, TitlebarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NbInputModule,
    RouterLink,
    NbPopoverModule,
    NbButtonModule,
    NbIconModule,
    NgOptimizedImage],
  exports: [TranslateModule, WebviewDirective, FormsModule, ShortcutInputComponent, PieButtonsComponent, TitlebarComponent]
})
export class SharedModule {
}
