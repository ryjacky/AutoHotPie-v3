import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { ShortcutInputComponent } from './components/shortcut-input/shortcut-input.component';
import {NbInputModule} from '@nebular/theme';
import {PieButtonsComponent} from './components/pie-buttons/pie-buttons.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ShortcutInputComponent, PieButtonsComponent],
  imports: [CommonModule, TranslateModule, FormsModule, NbInputModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, ShortcutInputComponent, PieButtonsComponent]
})
export class SharedModule {}
