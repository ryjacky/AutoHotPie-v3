import { Component } from '@angular/core';
import {PieMenuService} from '../../../core/services/pieMenu/pie-menu.service';

@Component({
  selector: 'app-settings-tab',
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.scss']
})
export class SettingsTabComponent {
  selectionColor: any;
  pieMenuService: PieMenuService;

  constructor(pieMenuService: PieMenuService) {
    this.pieMenuService = pieMenuService;
    this.selectionColor = pieMenuService.mainColor;
  }
  updatePieMenu() {
    // TODO: UPDATE the state}
  }
}
