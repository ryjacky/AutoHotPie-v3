import {AfterContentChecked, AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {PieMenuService} from '../core/services/pieMenu/pie-menu.service';

@Component({
  selector: 'app-pie-menu-ui',
  templateUrl: './pie-menu-ui.component.html',
  styleUrls: ['./pie-menu-ui.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuUIComponent {
  @Input() editorMode = false;
  constructor() {}
}
