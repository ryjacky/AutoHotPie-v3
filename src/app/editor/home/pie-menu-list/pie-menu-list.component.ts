import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PieletteDBHelper} from '../../../../../app/src/data/userData/PieletteDB';
import {PieMenu} from '../../../../../app/src/data/userData/PieMenu';

@Component({
  selector: 'app-pie-menu-list',
  templateUrl: './pie-menu-list.component.html',
  styleUrls: ['./pie-menu-list.component.scss']
})
export class PieMenuListComponent implements OnChanges {
  @Input() pieMenuIds: number[] = [];
  @Output() pieMenuChange = new EventEmitter<{remove: number|undefined; add: number|undefined}>();

  pieMenus: Array<PieMenu> = [];

  refreshPieMenuList() {
    PieletteDBHelper.pieMenu.bulkGet(this.pieMenuIds).then((pieMenus) => {
      this.pieMenus = [];

      for (const pieMenu of pieMenus) {
        if (pieMenu !== undefined) {
          this.pieMenus.push(pieMenu);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshPieMenuList();
  }
}
