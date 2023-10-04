import {Component, Input, OnInit} from '@angular/core';
import {PieMenuState} from './state/PieMenuState';
import {PieletteDBHelper} from '../../../app/src/db/PieletteDB';
import {PieItem} from '../../../app/src/db/data/PieItem';
import {PieTaskContext} from '../../../app/src/actions/PieTaskContext';
import {PieMenu} from '../../../app/src/db/data/PieMenu';

@Component({
  selector: 'app-pie-menu-editor',
  templateUrl: './pie-menu-editor.component.html',
  styleUrls: ['./pie-menu-editor.component.scss']
})
export class PieMenuEditorComponent {
  @Input() pieMenuId: number;

  // pieMenuStateLoaded is used to prevent the work area from loading until the pie menu state has created.
  // pieMenuStateLoaded?: Promise<boolean>;
  pieMenuState: PieMenuState = new PieMenuState(new PieMenu(), new Map<number, PieItem>());
  activePieItemId: number | undefined;

  constructor() {
    this.pieMenuId = parseInt(new URL(window.location.href.replace('#/', '')).searchParams.get('pieMenuId') ?? '0', 10);

    window.log.debug('Pie Menu Editor is opening pie menu of id: ' + this.pieMenuId);

    // TODO: Get back the save button
    window.onclick = () => {
      this.pieMenuState.save();
      window.log.debug('Pie menu state saved');
    };

    this.loadWorkArea(this.pieMenuId);
  }

  async loadWorkArea(pieMenuId: number) {
    const pieMenu = await PieletteDBHelper.pieMenu.get(pieMenuId);

    if (!pieMenu) {
      throw new Error('Pie Menu not found');
    }
    const rawPieItems = await PieletteDBHelper.pieItem.bulkGet(pieMenu.pieItemIds);
    const pieItems = new Map<number, PieItem>();

    window.log.debug('Finding pie items: ' + JSON.stringify(pieMenu.pieItemIds));
    window.log.debug('Found pie items: ' + JSON.stringify(rawPieItems));

    for (let i = 0; i < rawPieItems.length; i++) {
      if (rawPieItems[i] === undefined) {
        throw new Error('Trying to load work area but pie Item of id ' + pieMenu.pieItemIds[i] + ' not found');
      }

      pieItems.set(pieMenu.pieItemIds[i], rawPieItems[i] as PieItem);
    }

    this.pieMenuState = new PieMenuState(pieMenu, pieItems);
    window.log.warn('Map objects (pieItems) cannot be serialized to JSON');
    window.log.warn('Pie menu state: ' + JSON.stringify(this.pieMenuState));

    this.activePieItemId = this.pieMenuState.pieMenuItemIds[0];
    // this.pieMenuStateLoaded = Promise.resolve(true);
  }

  moveUp(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1);
    if (i > 0) {
      const temp = actions[i - 1];
      actions[i - 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuState.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  moveDown(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1);

    if (i < actions.length - 1) {
      const temp = actions[i + 1];
      actions[i + 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuState.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  deleteAction(i: number) {
    if (!this.isStateOperable()) { return; }

    if (this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).length ?? 0 > 0) {
      this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).splice(i, 1);
    }
  }

  addAction() {
    if (!this.isStateOperable()) { return; }

    this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).push(new PieTaskContext('ahp-send-key', {}));
  }

  isStateOperable(): boolean{
    if (this.activePieItemId === undefined || !this.pieMenuState || !this.pieMenuState.hasPieItem(this.activePieItemId)) {
      window.log.error('Either selectedPieItemId or pieMenuState.pieItems is undefined');
      window.log.error('selectedPieItemId: ' + this.activePieItemId);
      // window.log.error('pieMenuState.pieItems: ' + this.pieMenuState?.pieItems);
      return false;
    }
    if (!this.pieMenuState.hasPieItem(this.activePieItemId)) {
      window.log.error(`Pie menu state for pie item ${this.activePieItemId} is undefined`);

      return false;
    }

    return true;
  }
}
