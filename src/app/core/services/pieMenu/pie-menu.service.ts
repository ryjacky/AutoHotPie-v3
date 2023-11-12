import {Injectable} from '@angular/core';
import {IPieItem, PieItem} from '../../../../../app/src/db/data/PieItem';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieSingleTaskContext} from '../../../../../app/src/pieTask/PieSingleTaskContext';
import {DBService} from '../db/db.service';

enum PieMenuServiceState { loading, loaded, unloaded }

export class PieMenuStateError extends Error {}
export class PieMenuNotFoundError extends Error {}
export class PieItemNotFoundError extends Error {}
class PieMenuUnloadedError extends Error {}

/**
 * Service to load and save the pie menu state.
 */
@Injectable()
export class PieMenuService extends PieMenu {
  // <PieItemId, PieItem>
  public readonly pieItems = new Map<number, IPieItem>();
  private state = PieMenuServiceState.unloaded;

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
  public addPieItemTaskContext(pieItemId: number, pieSingleTaskContext: PieSingleTaskContext): void {
    this.getPieItemTaskContexts(pieItemId).push(pieSingleTaskContext);
    this.save();
  }
  public async addEmptyPieItem() {
    const pieItem = new PieItem('');
    pieItem.id = await this.dbService.pieItem.put(pieItem) as number;

    this.pieItems.set(pieItem.id, pieItem);
    this.pieItemIds.push(pieItem.id);
  }

  /**
   * Same as load, but will load the pie menu again even if it is already loaded.
   * @param pieMenuId
   */
  public async forceLoad(pieMenuId: number) {
    this.state = PieMenuServiceState.unloaded;
    return this.load(pieMenuId);
  }

  public async load(pieMenuId: number, reload = false){
    if (this.state === PieMenuServiceState.loading) {
      throw new PieMenuStateError('Pie Menu Service locked, loading in progress');
    }
    if (this.state === PieMenuServiceState.loaded) {
      throw new PieMenuStateError('Pie Menu is already loaded, use forceLoad to reload and overwrite changes');
    }

    this.state = PieMenuServiceState.loading;

    this.id = pieMenuId;
    const pieMenu = await this.dbService.pieMenu.get(pieMenuId);
    if (!pieMenu) {
      this.state = PieMenuServiceState.unloaded;
      throw new PieMenuNotFoundError();
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
    window.log.debug(`${this.pieItems.size} pie items loaded`);

    const pieItems = await this.dbService.pieItem.bulkGet(pieMenu.pieItemIds);
    for (let i = 0; i < pieItems.length; i++) {
      window.log.debug('Loading pie item ' + pieMenu.pieItemIds[i]);
      const currentPieItem = pieItems[i];
      if (currentPieItem === undefined) {
        throw new PieItemNotFoundError();
      }

      this.pieItems.set(pieMenu.pieItemIds[i], currentPieItem);
    }

    window.log.debug(`${this.pieItems.size} pie items loaded`);

    this.state = PieMenuServiceState.loaded;
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

  public setPieItemActions(id: number, actions: PieSingleTaskContext[]) {
    if (this.pieItems.get(id) === undefined) {
      return;
    }

    // this.pieItems.get(id)?.pieTask must not be undefined
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    this.pieItems.get(id)!.pieTaskContexts = actions;
  }
  public movePieTaskUp(pieItemId: number, pieTaskIndex: number) {
    const actions = this.getPieItemTaskContexts(pieItemId);
    if (pieTaskIndex > 0) {
      const temp = actions[pieTaskIndex - 1];
      actions[pieTaskIndex - 1] = actions[pieTaskIndex];
      actions[pieTaskIndex] = temp;
    }

    this.setPieItemActions(pieItemId, actions);

    this.save();
  }

  public movePieTaskDown(pieItemId: number, pieTaskIndex: number) {
    const actions = this.getPieItemTaskContexts(pieItemId);

    if (pieTaskIndex < actions.length - 1) {
      const temp = actions[pieTaskIndex + 1];
      actions[pieTaskIndex + 1] = actions[pieTaskIndex];
      actions[pieTaskIndex] = temp;
    }

    this.setPieItemActions(pieItemId, actions);

    this.save();
  }

  public deletePieTask(pieItemId: number, pieTaskIndex: number) {
    if (this.getPieItemTaskContexts(pieItemId).length ?? 0 > 0) {
      this.getPieItemTaskContexts(pieItemId).splice(pieTaskIndex, 1);
    }
    this.save();
  }
  public async save() {
    if (this.state !== PieMenuServiceState.loaded) {
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
