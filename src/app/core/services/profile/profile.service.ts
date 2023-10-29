import {Profile} from '../../../../../app/src/db/data/Profile';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieItem} from '../../../../../app/src/db/data/PieItem';
import {DBService} from '../db/db.service';
import {Injectable} from '@angular/core';

/**
 * Profile service for a single profile
 */
@Injectable()
export class ProfileService extends Profile {
  loaded = false;
  public readonly pieMenus = new Map<number, IPieMenu | undefined>();

  /**
   * Number of profiles that are using a pie menu,
   * key is pie menu id, value is number of profiles
   */
  public readonly nProfileConnected = new Map<number, number>();

  constructor(
    private dbService: DBService,
  ) {
    super();
  }

  public async load(profileId: number, reload = false) {
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

  isHotkeyAvailable(hotkey: string) {
    for (const pieMenuHotkey of this.pieMenuHotkeys) {
      if (pieMenuHotkey.includes(hotkey)){ return false; }
    }
    return true;
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

  async setPieMenuHotkey(pieMenuId: number, newHotkey: string, replace = false) {
    if (!this.isHotkeyAvailable(newHotkey)) {
      if (!replace) {
        window.log.warn('Hotkey ' + newHotkey + ' already in use');
        return;
      } else {
        await this.removePieMenuHotkey(newHotkey);
      }
    }

    this.pieMenuHotkeys = this.pieMenuHotkeys.filter((hotkey) => !hotkey.endsWith(`-${pieMenuId}`));
    this.pieMenuHotkeys.push(`${newHotkey}-${pieMenuId}`);
    this.dbService.profile.update(this.id ?? 0, {pieMenuHotkeys: this.pieMenuHotkeys});
  }

  addExe(path: string) {
    this.exes.push(path);
    this.dbService.profile.update(this.id ?? 0, {exes: this.exes});
  }

  removeExe(path: string) {
    this.exes = this.exes.filter((exe) => exe !== path);
    this.dbService.profile.update(this.id ?? 0, {exes: this.exes});
  }

  removePieMenu(pieMenuId: number) {
    this.pieMenuHotkeys = this.pieMenuHotkeys.filter((hotkey) => !hotkey.endsWith(`-${pieMenuId}`));
    this.pieMenuIds = this.pieMenuIds.filter((id) => id !== pieMenuId);
    this.dbService.profile.update(
      this.id ?? 0,
      {pieMenuIds: this.pieMenuIds, pieMenuHotkeys: this.pieMenuHotkeys});
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

  getHotkey(pieMenuId: number) {
    window.log.debug('Getting hotkey for pie menu ' + pieMenuId);
    return this.pieMenuHotkeys.find((pieMenuHotkey) => pieMenuHotkey.endsWith(`-${pieMenuId}`)) ?? '';
  }

  async removePieMenuHotkey(hotkey: string) {
    this.pieMenuHotkeys = this.pieMenuHotkeys.filter((pieMenuHotkey) => !pieMenuHotkey.includes(hotkey));
    await this.dbService.profile.update(this.id ?? 0, {pieMenuHotkeys: this.pieMenuHotkeys});
  }
}
