import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PieMenuState, PieMenuStateManager} from './state/PieMenuState';
import {PieletteDBHelper} from '../../../app/src/db/PieletteDB';
import {PieItem} from '../../../app/src/db/data/PieItem';

@Component({
  selector: 'app-pie-menu-editor',
  templateUrl: './pie-menu-editor.component.html',
  styleUrls: ['./pie-menu-editor.component.scss']
})
export class PieMenuEditorComponent {
  @Input() pieMenuId: number;

  pieMenuStates: ReadonlyArray<PieMenuState> = PieMenuStateManager.instance.readonlyPieMenuStates;

  // pieMenuStateLoaded is used to prevent the work area from loading until the pie menu state has created.
  pieMenuStateLoaded?: Promise<boolean>;

  constructor(private activatedRoute: ActivatedRoute) {

    this.pieMenuId = parseInt(this.activatedRoute.snapshot.paramMap.get('pieMenuId') ?? '0', 10);

    window.log.debug('Pie Menu Editor is opening pie menu of id: ' + this.pieMenuId);

    window.electronAPI.disablePieMenu();
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

    const pieMenuState = new PieMenuState(pieMenu, pieItems);
    window.log.warn('Map objects (pieItems) cannot be serialized to JSON');
    window.log.warn('Pie menu state: ' + JSON.stringify(pieMenuState));

    PieMenuStateManager.instance.addPieMenuState(pieMenuState);
    this.pieMenuStateLoaded = Promise.resolve(true);
  }

  clearState() {
    PieMenuStateManager.instance.clearPieMenuStates();
    window.electronAPI.enablePieMenu();
  }

  savePieMenuState() {
    PieMenuStateManager.instance.activePieMenuState.save();
  }
}
