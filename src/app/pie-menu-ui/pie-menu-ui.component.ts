import {Component, ElementRef, ViewChild} from '@angular/core';
import {PieMenuService} from '../core/services/pieMenu/pie-menu.service';

// TODO: The whole pie menu window is needed to be review, it's a mess
@Component({
  selector: 'app-pie-menu-ui',
  templateUrl: './pie-menu-ui.component.html',
  styleUrls: ['./pie-menu-ui.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuUIComponent {
  @ViewChild('appPieButtons') appPieButtons!: ElementRef<HTMLElement>;

  pieMenuId = 19;

  constructor(pieMenuService: PieMenuService) {
    pieMenuService.load(19, true).then(() => {
      this.pieMenuId = 19;
    });
  }
}
