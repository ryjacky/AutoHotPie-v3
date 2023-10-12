import {Component} from '@angular/core';
import {PieMenuService} from '../core/services/pieMenu/pie-menu.service';

@Component({
  selector: 'app-pie-menu-ui',
  templateUrl: './pie-menu-ui.component.html',
  styleUrls: ['./pie-menu-ui.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuUIComponent {
  centerX = 0;
  centerY = 0;

  nextCenterX = 0;
  nextCenterY = 0;

  canCenterUpdate = false;
  centerWaitingUpdate = false;

  pieMenuId = 1;

  constructor(pieMenuService: PieMenuService) {
    window.electronAPI.openPieMenu((pieMenuId: number) => {
      if (this.centerWaitingUpdate) {
        this.updateCenter();
      } else {
        this.canCenterUpdate = true;
      }
      this.pieMenuId = pieMenuId;
    });
  }

  pointerEnter($event: PointerEvent) {
    this.nextCenterX = $event.clientX;
    this.nextCenterY = $event.clientY;

    if (this.canCenterUpdate) {
      this.updateCenter();
    }
  }

  updateCenter() {
    this.centerX = this.nextCenterX;
    this.centerY = this.nextCenterY;
    this.canCenterUpdate = false;
    this.centerWaitingUpdate = false;
  }
}
