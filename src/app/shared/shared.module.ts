import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule} from '@angular/forms';
import {ShortcutInputComponent} from './components/shortcut-input/shortcut-input.component';
import {
  NbAccordionModule, NbButtonGroupModule,
  NbButtonModule,
  NbCardModule, NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule, NbRadioModule, NbTooltipModule
} from '@nebular/theme';
import {PieButtonsComponent} from './components/pie-buttons/pie-buttons.component';
import {TitlebarComponent} from './components/titlebar/titlebar.component';
import {RouterLink} from '@angular/router';
import { EditorTitlebarComponent } from './components/editor-titlebar/editor-titlebar.component';
import { NumberSliderFieldComponent } from './components/number-slider-field/number-slider-field.component';
import { NbIconPickerComponent } from './components/nb-icon-picker/nb-icon-picker.component';
import { AdvancedShortcutInputComponent } from './components/advanced-shortcut-input/advanced-shortcut-input.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ShortcutInputComponent,
    PieButtonsComponent,
    TitlebarComponent,
    EditorTitlebarComponent,
    NumberSliderFieldComponent,
    NumberSliderFieldComponent,
    NbIconPickerComponent,
    AdvancedShortcutInputComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NbInputModule,
    RouterLink,
    NbPopoverModule,
    NbButtonModule,
    NbIconModule,
    NgOptimizedImage,
    NbFormFieldModule,
    NbCardModule,
    NbTooltipModule,
    NbAccordionModule,
    NbButtonGroupModule,
    NbCheckboxModule,
    NbRadioModule
  ],
    exports: [TranslateModule,
        WebviewDirective,
        FormsModule,
        ShortcutInputComponent,
        PieButtonsComponent,
        TitlebarComponent,
        EditorTitlebarComponent, NumberSliderFieldComponent, NumberSliderFieldComponent, AdvancedShortcutInputComponent]
})
export class SharedModule {
}
