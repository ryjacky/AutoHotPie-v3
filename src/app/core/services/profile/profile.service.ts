import {Profile} from '../../../../../app/src/db/data/Profile';
import {IPieMenu, MouseKeyEvent, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieItem} from '../../../../../app/src/db/data/PieItem';
import {MouseKeyEventObject} from '../../../../../app/src/mouseKeyEvent/MouseKeyEventObject';
import {DBService} from '../db/db.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService extends Profile {
  loaded = false;
  public readonly pieMenus = new Map<number, IPieMenu | undefined>();
  public readonly nProfileConnected = new Map<number, number>();

  constructor(
    private dbService: DBService,
  ) {
    super();
  }

  public async load(profileId: number, reload = false){
    if (this.loaded && !reload) {
      window.log.error('Pie Menu Service already loaded');
      return;
    }

    this.id = profileId;
    const profile = await this.dbService.profile.get(profileId);
    if (!profile) {
      window.log.error('Pie Menu not found');
      return;
    }

    // Not using Object.assign(this, pieMenu); because we cannot guarantee
    // that the database object has the same properties as the class,
    // e.g. a structure change due to program update.
    for (const profileKey in profile) {
      if (profileKey in this) {
        // @ts-ignore
        this[profileKey] = profile[profileKey];
      }
    }

    this.pieMenus.clear();
    const pieMenu = await this.dbService.pieMenu.bulkGet(profile.pieMenuIds);
    for (let i = 0; i < pieMenu.length; i++) {
      if (pieMenu[i] === undefined) {
        window.log.warn('Trying to load profile but pie menu of id ' + profile.pieMenuIds[i] + ' not found');
        continue;
      }

      // Seems like .equals automatically does what Array.contains() do
      this.nProfileConnected.set(
        profile.pieMenuIds[i],
        await this.dbService.profile.where('pieMenuIds').equals(pieMenu[i]?.id ?? 0).count());
      this.pieMenus.set(profile.pieMenuIds[i], pieMenu[i]);
    }

    this.loaded = true;
  }

  setName(name: string) {
    this.name = name;
    this.dbService.profile.update(this.id ?? 0, {name: this.name});
  }

  toggle() {
    this.enabled = !this.enabled;
    this.dbService.profile.update(this.id ?? 0, {enabled: this.enabled});
  }

  /**
   * Instantiate the pie menu with pieMenuId, or unlink it from other profiles, so that the pie menu
   * only exists in this profile.
   *
   * @param pieMenuId
   */
  async makePieMenuUnique(pieMenuId: number) {
    const pieMenu = this.pieMenus.get(pieMenuId);
    if (!pieMenu) {
      window.log.error('Pie Menu not found, cannot make it unique');
      return;
    }

    if (this.nProfileConnected.get(pieMenu.id ?? 0) ?? 0 > 1) {
      window.log.info('Duplicating pie menu ' + pieMenu.id + ' (name: ' + pieMenu.name + ')');

      await this.createAndAddPieMenu(pieMenu, pieMenu.id);
    }
  }

  /**
   *
   * @param fromPieMenu The original pie menu to be copied. If not provided, a new pie menu will be created.
   * @param replacePieMenuId If provided, the new pie menu will replace the pie menu with this id.
   */
  async createAndAddPieMenu(fromPieMenu?: IPieMenu, replacePieMenuId?: number) {
    let newPieMenu: PieMenu;
    if (fromPieMenu) {
      newPieMenu = structuredClone(fromPieMenu);
      newPieMenu.id = undefined;
    } else {
      newPieMenu = new PieMenu();
      const pieItemId = await this.dbService.pieItem.add(new PieItem(''));
      newPieMenu.pieItemIds = [pieItemId as number];
    }

    const newPieMenuId = await this.dbService.pieMenu.add(newPieMenu);
    newPieMenu.id = newPieMenuId as number;
    this.addPieMenu(newPieMenu, replacePieMenuId);
  }

  async addPieMenu(pieMenu: PieMenu, replacePieMenuId?: number) {
    window.log.debug('Adding pie menu ' + pieMenu.id + ' (name: ' + pieMenu.name + ')');

    if (replacePieMenuId) {
      this.pieMenuIds = this.pieMenuIds.map((id) => id === replacePieMenuId ? pieMenu.id ?? -1 : id);
    } else {
      this.pieMenuIds.push(pieMenu.id ?? -1);
    }
    this.pieMenus.set(pieMenu.id ?? -1, pieMenu);

    await this.dbService.profile.update(this.id ?? 0, {pieMenuIds: this.pieMenuIds});

    this.nProfileConnected.set(
      pieMenu.id ?? -1,
      await this.dbService.profile.where('pieMenuIds').equals(pieMenu.id ?? -1).count());
  }

  setPieMenuHotkey(pieMenuId: number, hotkey: MouseKeyEvent) {
    if (hotkey.length !== 7){
      window.log.error('Invalid hotkey, length is not 7: ' + hotkey.length);
      return;
    }
    if (!MouseKeyEventObject.eventTypes.find((element) => element === hotkey[0])){
      window.log.error('Invalid hotkey, event name does not exist: ' + hotkey[0]);
      return;
    }

    const pieMenu = this.pieMenus.get(pieMenuId);

    if (pieMenu) {
      pieMenu.hotkey = MouseKeyEventObject.stringify(hotkey);
      this.dbService.pieMenu.update(pieMenuId, {hotkey: pieMenu.hotkey});
    }
  }

  addExe(path: string){
    this.exes.push(path);
    this.dbService.profile.update(this.id ?? 0, {exes: this.exes});
  }

  removeExe(path: string){
    this.exes = this.exes.filter((exe) => exe !== path);
    this.dbService.profile.update(this.id ?? 0, {exes: this.exes});
  }

  removePieMenu(pieMenuId: number) {
    this.pieMenuIds = this.pieMenuIds.filter((id) => id !== pieMenuId);
    this.dbService.profile.update(this.id ?? 0, {pieMenuIds: this.pieMenuIds});
  }

  setPieMenuMainColor(pieMenuId: number, color: string) {
    const pieMenu = this.pieMenus.get(pieMenuId);

    if (pieMenu) {
      pieMenu.mainColor = color;
      this.dbService.pieMenu.update(pieMenuId, {mainColor: color});
    }
  }

  setPieMenuName(pieMenuId: number, value: string) {
    const pieMenu = this.pieMenus.get(pieMenuId);
    if (pieMenu) {
      window.log.debug('Setting pie menu name to ' + value);
      pieMenu.name = value;
      this.dbService.pieMenu.update(pieMenuId, {name: value});
    } else {
      window.log.error('Pie menu of id: ' + pieMenuId + ' not found');
    }
  }
}
