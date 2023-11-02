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
  public changesSaved = true;

  private loaded = false;
  private loading = false;

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

  public async load(pieMenuId: number, reload = false) {
    if (this.loading) {
      window.log.error('Pie Menu Service locked, loading in progress');
      return;
    }
    if (this.loaded && !reload) {
      window.log.error('Pie Menu Service already loaded');
      return;
    }

    this.loading = true;

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
    window.log.debug(`${this.pieItems.size} pie items loaded`);

    const pieItems = await this.dbService.pieItem.bulkGet(pieMenu.pieItemIds);
    for (let i = 0; i < pieItems.length; i++) {
      window.log.debug('Loading pie item ' + pieMenu.pieItemIds[i]);
      if (pieItems[i] === undefined) {
        window.log.warn('Trying to load work area but pie Item of id ' + pieMenu.pieItemIds[i] + ' not found');
        continue;
      }

      this.pieItems.set(pieMenu.pieItemIds[i], pieItems[i]);
    }

    window.log.debug(`${this.pieItems.size} pie items loaded`);

    this.loading = false;
    this.loaded = true;
  }

  public getPieItemNameAt(pieItemId: number): string {
    return this.pieItems.get(pieItemId)?.name ?? '';
  }

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
    if (!this.loaded) {
      window.log.warn('Cannot save pie menu state, not loaded');
      return;
    }

    this.changesSaved = false;

    window.log.debug('Saving pie menu state: ' + JSON.stringify(this.basePieMenu));
    await this.dbService.pieMenu.update(this.id ?? -1, this.basePieMenu);

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

  async checkConditions(
    exePath: string,
    ctrl = false,
    alt = false,
    shift = false,
    key: string) {

    window.log.debug('Checking pie menu conditions for ' + exePath + ' ' + ctrl + ' ' + alt + ' ' + shift + ' ' + key);

    let profId = (await this.dbService.profile.where('exes').equals(exePath).first())?.id;
    profId ??= 1;

    window.log.debug('Checking pie menu conditions with profile id ' + profId);

    const firstProfilePieMenuData = await this.dbService.profilePieMenuData
      .where('[profileId+key]')
      .equals([profId ?? -1, key])
      .and(profilePieMenuData =>
        profilePieMenuData.ctrl === ctrl &&
        profilePieMenuData.alt === alt &&
        profilePieMenuData.shift === shift
      ).first();

    window.log.debug('First profile pie menu data: ' + JSON.stringify(firstProfilePieMenuData));
    window.log.debug('Pie menu id: ' + this.id);

    return firstProfilePieMenuData?.pieMenuId === this.id;
  }

  private getPieItemTaskContexts(id: number): PieSingleTaskContext[] {
    return this.pieItems.get(id)?.pieTaskContexts ?? [];
  }
}
