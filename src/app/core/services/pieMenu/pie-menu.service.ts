import {Injectable} from '@angular/core';
import {IPieItem} from '../../../../../app/src/db/data/PieItem';
import {PieletteDBHelper} from '../../../../../app/src/db/PieletteDB';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieSingleTaskContext} from '../../../../../app/src/actions/PieSingleTaskContext';

@Injectable()
export class PieMenuService extends PieMenu {
  private pieItems = new Map<number, IPieItem | undefined>();
  private loaded = false;
  constructor() {
    super();
  }

  public get basePieMenu(): IPieMenu {
    const basePieMenu = new PieMenu();
    for (const pieMenuKey in basePieMenu) {
      if (pieMenuKey in this) {
        // @ts-ignore
        basePieMenu[pieMenuKey] = this[pieMenuKey];
      }
    }
    return basePieMenu;
  }

  public async load(pieMenuId: number, reload = false){
    if (this.loaded && !reload) {
      window.log.error('Pie Menu Service already loaded');
      return;
    }

    this.id = pieMenuId;
    const pieMenu = await PieletteDBHelper.pieMenu.get(pieMenuId);
    if (!pieMenu) {
      window.log.error('Pie Menu not found');
      return;
    }

    // Not using Object.assign(this, pieMenu); because we cannot guarantee
    // that the database object has the same properties as the class,
    // e.g. a structure change due to program update.
    for (const pieMenuKey in pieMenu) {
      if (pieMenuKey in this) {
        // @ts-ignore
        this[pieMenuKey] = pieMenu[pieMenuKey];
      }
    }

    const pieItems = await PieletteDBHelper.pieItem.bulkGet(pieMenu.pieItemIds);
    for (let i = 0; i < pieItems.length; i++) {
      if (pieItems[i] === undefined) {
        window.log.warn('Trying to load work area but pie Item of id ' + pieMenu.pieItemIds[i] + ' not found');
        continue;
      }

      this.pieItems.set(pieMenu.pieItemIds[i], pieItems[i]);
    }

    this.loaded = true;
  }

  public getPieTaskContext(pieItemId: number): PieSingleTaskContext[] | undefined {
    return this.pieItems.get(pieItemId)?.pieTaskContexts;
  }

  public hasPieItem(id: number): boolean {
    return this.pieItems.get(id) !== undefined;
  }

  public getPieItemActions(id: number): PieSingleTaskContext[] {
    return this.pieItems.get(id)?.pieTaskContexts ?? [];
  }

  public setPieItemActions(id: number, actions: PieSingleTaskContext[]) {
    if (this.pieItems.get(id) === undefined) {
      return;
    }

    // this.pieItems.get(id)?.actions must not be undefined
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    this.pieItems.get(id)!.pieTaskContexts = actions;
  }
  public save() {
    if (!this.loaded) {
      window.log.warn('Cannot save pie menu state, not loaded');
      return;
    }

    window.log.debug('Saving pie menu state: ' + JSON.stringify(this.basePieMenu));
    PieletteDBHelper.pieMenu.update(this.id ?? -1, this.basePieMenu);

    for (const pieItem of this.pieItems.values()) {
      if (pieItem) {
        PieletteDBHelper.pieItem.put(pieItem, pieItem.id);
      }
    }
  }
}
