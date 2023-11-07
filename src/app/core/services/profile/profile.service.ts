import {Profile} from '../../../../../app/src/db/data/Profile';
import {IPieMenu, PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieItem} from '../../../../../app/src/db/data/PieItem';
import {DBService} from '../db/db.service';
import {Injectable} from '@angular/core';
import {IProfilePieMenuData, ProfilePieMenuData} from '../../../../../app/src/db/data/ProfilePieMenuData';

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

  private profilePieMenuData: IProfilePieMenuData[] = [];

  constructor(
    private dbService: DBService,
  ) {
    super();
  }

  get pieMenuIds(): number[] {
    return Array.from(this.pieMenus.keys());
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

    this.profilePieMenuData =
      await this.dbService.profilePieMenuData.where('profileId').equals(this.id ?? -1).toArray();

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

    const pieMenuIds =
      this.profilePieMenuData.map((profilePieMenuData) => profilePieMenuData.pieMenuId);

    const pieMenu = await this.dbService.pieMenu.bulkGet(pieMenuIds);
    for (let i = 0; i < pieMenu.length; i++) {
      if (pieMenu[i] === undefined) {
        window.log.warn('Trying to load profile but pie menu of id ' + pieMenuIds[i] + ' not found');
        continue;
      }

      this.nProfileConnected.set(
        pieMenuIds[i],
        await this.dbService.profilePieMenuData.where('pieMenuId').equals(pieMenuIds[i]).count());
      this.pieMenus.set(pieMenuIds[i], pieMenu[i]);
    }

    this.loaded = true;
  }

  async isHotkeyAvailable(ctrl: boolean, shift: boolean, alt: boolean, key: string): Promise<boolean> {
    return await this.dbService.profilePieMenuData
      .where('[profileId+key]').equals([this.id ?? -1, key])
      .and((data) =>
        data.ctrl === ctrl &&
        data.alt === alt &&
        data.shift === shift
      ).count() === 0;
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
    const fromPieMenu = this.pieMenus.get(pieMenuId);
    if (!fromPieMenu) {
      window.log.error('Pie Menu not found, cannot make it unique');
      return;
    }

    if ((this.nProfileConnected.get(pieMenuId) ?? 0) > 1) {
      window.log.info('Duplicating pie menu ' + fromPieMenu.id + ' (name: ' + fromPieMenu.name + ')');

      const newPieMenu = structuredClone(fromPieMenu);
      newPieMenu.id = undefined;
      newPieMenu.id = (await this.dbService.pieMenu.put(newPieMenu)) as number;

      await this.addPieMenu(newPieMenu);
      this.removePieMenu(fromPieMenu.id ?? -1);
    }
  }

  /**
   *
   */
  async createAndAddPieMenu() {
    const newPieMenu = new PieMenu();
    const pieItemId = await this.dbService.pieItem.add(new PieItem(''));
    newPieMenu.pieItemIds = [pieItemId as number];

    await this.dbService.pieMenu.put(newPieMenu);
    await this.addPieMenu(newPieMenu);
  }

  async addPieMenu(pieMenu: PieMenu) {
    window.log.debug('Adding pie menu ' + pieMenu.id + ' (name: ' + pieMenu.name + ')');

    this.dbService.profilePieMenuData.put(new ProfilePieMenuData(
      this.id ?? -1,
pieMenu.id ?? -1,
      false,
      false,
      false,
      '',
      ));

    this.pieMenus.set(pieMenu.id ?? -1, pieMenu);

    this.nProfileConnected.set(
      pieMenu.id ?? -1,
      await this.dbService.profilePieMenuData.where('pieMenuId').equals(pieMenu.id ?? -1).count());
  }

  async setPieMenuHotkey(
    pieMenuId: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean,
    key: string,
    replace = false
  ) {
    let profilePieMenuData = await this.dbService.profilePieMenuData
      .where('[profileId+key]').equals([this.id ?? -1, key])
      .and((data) =>
        data.ctrl === ctrl &&
        data.alt === alt &&
        data.shift === shift
      ).first();

    if (profilePieMenuData) {
      if (!replace) {
        window.log.warn('Hotkey already in use');
        return;
      } else {
        this.dbService.profilePieMenuData.delete(profilePieMenuData.id ?? -1);
      }
    }

    profilePieMenuData
      = await this.dbService.profilePieMenuData
      .where('[profileId+pieMenuId]').equals([this.id ?? -1, pieMenuId])
      .first();

    if (profilePieMenuData) {
      profilePieMenuData.ctrl = ctrl;
      profilePieMenuData.shift = shift;
      profilePieMenuData.alt = alt;
      profilePieMenuData.key = key;

      this.dbService.profilePieMenuData.update(profilePieMenuData.id ?? -1, profilePieMenuData);
    } else {
      window.log.error('Pie menu not found, cannot add hotkey');
    }

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
    this.dbService.profilePieMenuData
      .where('[profileId+pieMenuId]').equals([this.id ?? -1, pieMenuId])
      .first()
      .then((profilePieMenuData) => {
        if (profilePieMenuData) {
          this.dbService.profilePieMenuData.delete(profilePieMenuData.id ?? 0);
          this.profilePieMenuData = this.profilePieMenuData.filter((data) => data.id !== profilePieMenuData.id);
          this.pieMenus.delete(pieMenuId);
          this.nProfileConnected.delete(pieMenuId);
        }
      });
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

  async getHotkey(pieMenuId: number) {
    window.log.debug('Getting hotkey for pie menu ' + pieMenuId);
    const profilePieMenuData
      = await this.dbService.profilePieMenuData
      .where('[profileId+pieMenuId]').equals([this.id ?? -1, pieMenuId])
      .first();
    return new KeyboardEvent('keydown', {
      shiftKey: profilePieMenuData?.shift ?? false,
      ctrlKey: profilePieMenuData?.ctrl ?? false,
      altKey: profilePieMenuData?.alt ?? false,
      key: profilePieMenuData?.key ?? ''
    });
  }
}
