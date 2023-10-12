import {Injectable} from '@angular/core';
import {IPieItem, PieItem} from '../../../../../app/src/db/data/PieItem';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieSingleTaskContext} from '../../../../../app/src/actions/PieSingleTaskContext';
import {DBService} from '../db/db.service';

/**
 * Service to load and save the pie menu state.
 */
@Injectable()
export class PieMenuService extends PieMenu {
  // <PieItemId, PieItem>
  public readonly pieItems = new Map<number, IPieItem | undefined>();
  private loaded = false;

  constructor(
    private dbService: DBService,
  ) {
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

  public getPieItemNameAt(pieItemId: number): string {
    return this.pieItems.get(pieItemId)?.name ?? '';
  }

  public isIconAtPieItemNative(pieItemId: number): boolean {
    return (this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '').startsWith('[eva]');
  }

  public getPieItemIconAt(pieItemId: number): string {
    if (this.isIconAtPieItemNative(pieItemId)){
      return (this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '').replace('[eva]', '');
    }

    return this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '';
  }

  public async addEmptyPieItem() {
    const pieItem = new PieItem('');
    pieItem.id = await this.dbService.pieItem.put(pieItem) as number;

    this.pieItems.set(pieItem.id, pieItem);
    this.pieItemIds.push(pieItem.id);
  }

  public async load(pieMenuId: number, reload = false){
    if (this.loaded && !reload) {
      window.log.error('Pie Menu Service already loaded');
      return;
    }

    this.id = pieMenuId;
    const pieMenu = await this.dbService.pieMenu.get(pieMenuId);
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

    this.pieItems.clear();
    const pieItems = await this.dbService.pieItem.bulkGet(pieMenu.pieItemIds);
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

  public getPieItemTaskContexts(id: number): PieSingleTaskContext[] {
    return this.pieItems.get(id)?.pieTaskContexts ?? [];
  }

  movePieItemUp(i: number) {
    if (i > 0) {
      const temp = this.pieItemIds[i - 1];
      this.pieItemIds[i - 1] = this.pieItemIds[i];
      this.pieItemIds[i] = temp;
    }

    // Resetting the reference to force the UI to update
    this.pieItemIds = [...this.pieItemIds];
    this.dbService.pieMenu.update(this.id ?? -1, {pieItemIds: this.pieItemIds});
  }

  movePieItemDown(i: number) {
    if (i < this.pieItemIds.length - 1) {
      const temp = this.pieItemIds[i + 1];
      this.pieItemIds[i + 1] = this.pieItemIds[i];
      this.pieItemIds[i] = temp;
    }

    // Resetting the reference to force the UI to update
    this.pieItemIds = [...this.pieItemIds];
    this.dbService.pieMenu.update(this.id ?? -1, {pieItemIds: this.pieItemIds});
  }

  public setPieItemActions(id: number, actions: PieSingleTaskContext[]) {
    if (this.pieItems.get(id) === undefined) {
      return;
    }

    // this.pieItems.get(id)?.actions must not be undefined
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    this.pieItems.get(id)!.pieTaskContexts = actions;
  }
  public async save() {
    if (!this.loaded) {
      window.log.warn('Cannot save pie menu state, not loaded');
      return;
    }

    window.log.debug('Saving pie menu state: ' + JSON.stringify(this.basePieMenu));
    await this.dbService.pieMenu.update(this.id ?? -1, this.basePieMenu);

    const nonEmptyPieItems: PieItem[] = [];
    for (const pieItem of this.pieItems.values()) {
      if (pieItem) {
        nonEmptyPieItems.push(pieItem);
      }
    }
    await this.dbService.pieItem.bulkPut(nonEmptyPieItems);

  }

  removePieItem(pieItemId: number) {
    this.pieItems.delete(pieItemId);
    this.pieItemIds = this.pieItemIds.filter(id => id !== pieItemId);
  }

  removeIconAtPieItem(pieItemId: number) {
    const pieItem = this.pieItems.get(pieItemId);

    if (pieItem !== undefined) {
      pieItem.iconBase64 = '';
    }
  }
}
