import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HelpAndAboutComponent} from './help-and-about.component';
import {TranslateModule} from '@ngx-translate/core';
import {NbButtonModule} from '@nebular/theme';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [HelpAndAboutComponent],
    imports: [
        CommonModule,
        TranslateModule,
        NbButtonModule,
        SharedModule,
    ]
})
export class HelpAndAboutModule { }
