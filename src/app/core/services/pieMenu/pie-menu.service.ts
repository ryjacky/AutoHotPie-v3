import {Injectable} from '@angular/core';
import {IPieItem, PieItem} from '../../../../../app/src/db/data/PieItem';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieSingleTaskContext} from '../../../../../app/src/actions/PieSingleTaskContext';
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
  public readonly pieItems = new Map<number, IPieItem | undefined>();
  public changesSaved = true;

  private state = PieMenuServiceState.unloaded;

  constructor(private dbService: DBService) {super();}

  /**
   * Get the PieMenu object from the service.
   */
  public get pieMenu(): IPieMenu {
    const pieMenu = new PieMenu();
    Object.assign(pieMenu, this);
    return pieMenu;
  }

  /**
   * Same as load, but will load the pie menu again even if it is already loaded.
   * @param pieMenuId
   */
  public async forceLoad(pieMenuId: number) {
    this.state = PieMenuServiceState.unloaded;
    return this.load(pieMenuId);
  }

  /**
   * Load the pie menu from the database.
   * If the service is already loading a pie menu, the request will be ignored.
   *
   * @param pieMenuId The id of the pie menu to load.
   */
  public async load(pieMenuId: number) {
    if (this.state === PieMenuServiceState.loading) {
      throw new PieMenuStateError('Pie Menu Service locked, loading in progress');
    }
    if (this.state === PieMenuServiceState.loaded) {
      throw new PieMenuStateError('Pie Menu is already loaded, use forceLoad to reload and overwrite changes');
    }

    this.state = PieMenuServiceState.loading;
    const pieMenu = await this.dbService.pieMenu.get(pieMenuId);

    if (!pieMenu) {
      this.state = PieMenuServiceState.unloaded;
      throw new PieMenuNotFoundError('Pie Menu not found');
    }

    Object.assign(this, pieMenu);

    this.pieItems.clear();

    const pieItems = await this.dbService.pieItem.bulkGet(pieMenu.pieItemIds);
    for (let i = 0; i < pieItems.length; i++) {
      if (pieItems[i] === undefined) {
        this.state = PieMenuServiceState.unloaded;
        throw new PieItemNotFoundError(`Pie Item of id ${pieMenu.pieItemIds[i]} not found`);
      }
      this.pieItems.set(pieMenu.pieItemIds[i], pieItems[i]);
    }

    window.log.debug(`${this.pieItems.size} pie items loaded`);
    this.state = PieMenuServiceState.loaded;
  }

  /**
   * Get the displayed name of a pie item.
   * @param pieItemId
   */
  public getPieItemNameAt(pieItemId: number): string {
    return this.pieItems.get(pieItemId)?.name ?? '';
  }

  /**
   * Whether the icon of a pie item is a native Eva icon or an icon in base64.
   * @param pieItemId
   */
  public isIconAtPieItemNative(pieItemId: number): boolean {
    return (this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '').startsWith('[eva]');
  }


  public getPieItemIconAt(pieItemId: number): string {
    if (this.isIconAtPieItemNative(pieItemId)) {
      return (this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '').replace('[eva]', '');
    }

    return this.pieItems.get(pieItemId ?? -1)?.iconBase64 ?? '';
  }

  public getPieTaskContext(pieItemId: number): PieSingleTaskContext[] | undefined {
    return this.pieItems.get(pieItemId)?.pieTaskContexts;
  }

  public hasPieItem(id: number): boolean {
    return this.pieItems.get(id) !== undefined;
  }

  public getReadonlyPieItemTaskContexts(id: number): ReadonlyArray<PieSingleTaskContext> {
    return this.getPieItemTaskContexts(id);
  }

  // --------------------------------------------------------------
  // Setters
  // --------------------------------------------------------------

  public addPieItemTaskContext(pieItemId: number, pieSingleTaskContext: PieSingleTaskContext): void {
    this.getPieItemTaskContexts(pieItemId).push(pieSingleTaskContext);
    this.save();
  }
  public async addEmptyPieItem() {
    const pieItem = new PieItem('');
    pieItem.id = await this.dbService.pieItem.put(pieItem) as number;

    this.pieItems.set(pieItem.id, pieItem);
    this.pieItemIds.push(pieItem.id);

    this.save();
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
    this.save();
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
    this.save();
  }

  public setPieItemActions(id: number, actions: PieSingleTaskContext[]) {
    if (this.pieItems.get(id) === undefined) {
      return;
    }

    // this.pieItems.get(id)?.actions must not be undefined
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    this.pieItems.get(id)!.pieTaskContexts = actions;
    this.save();
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

  setEscapeRadius(value: number): void {
    this.escapeRadius = value;
    this.save();
  }

  setIconSize(value: number): void {
    this.iconSize = value;
    this.save();
  }

  setCenterRadius(value: number): void {
    this.centerRadius = value;
    this.save();
  }

  setCenterThickness(value: number): void {
    this.centerThickness = value;
    this.save();
  }

  setPieItemSpread(value: number): void {
    this.pieItemSpread = value;
    this.save();
  }

  setPieItemRoundness(value: number): void {
    this.pieItemRoundness = value;
    this.save();
  }

  setPieItemWidth(value: number): void {
    this.pieItemWidth = value;
    this.save();
  }

  setMainColor(value: string): void {
    this.mainColor = value;
    this.save();
  }

  setSecondaryColor(value: string): void {
    this.secondaryColor = value;
    this.save();
  }

  setIconColor(value: string): void {
    this.iconColor = value;
    this.save();
  }

  public async save() {
    if (this.state === PieMenuServiceState.unloaded) { throw new PieMenuUnloadedError(); }

    this.changesSaved = false;

    await this.dbService.pieMenu.update(this.id ?? -1, this.pieMenu);

    const nonEmptyPieItems: PieItem[] = [];
    for (const pieItem of this.pieItems.values()) {
      if (pieItem) {
        nonEmptyPieItems.push(pieItem);
      }
    }
    await this.dbService.pieItem.bulkPut(nonEmptyPieItems);

    this.changesSaved = true;
  }

  removePieItem(pieItemId: number) {
    this.pieItems.delete(pieItemId);
    this.pieItemIds = this.pieItemIds.filter(id => id !== pieItemId);
    this.save();
  }

  removeIconAtPieItem(pieItemId: number) {
    const pieItem = this.pieItems.get(pieItemId);

    if (pieItem !== undefined) {
      pieItem.iconBase64 = '';
    }
    this.save();
  }

  private getPieItemTaskContexts(id: number): PieSingleTaskContext[] {
    return this.pieItems.get(id)?.pieTaskContexts ?? [];
  }
}
