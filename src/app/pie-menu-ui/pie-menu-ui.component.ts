import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'app-pie-menu-ui',
  templateUrl: './pie-menu-ui.component.html',
  styleUrls: ['./pie-menu-ui.component.scss']
})
export class PieMenuUIComponent {
  @Input() editorMode = false;
}
