import { Injectable } from '@angular/core';
import {PieItem} from '../../../../../app/src/db/data/PieItem';
import {PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {Profile} from '../../../../../app/src/db/data/Profile';
import Dexie, {ObservabilitySet, Table} from 'dexie';
import {ProfilePieMenuData} from '../../../../../app/src/db/data/ProfilePieMenuData';

@Injectable({
  providedIn: 'platform'
})
export class DBService extends Dexie {

  pieItem!: Table<PieItem>;
  pieMenu!: Table<PieMenu>;
  profile!: Table<Profile>;
  profilePieMenuData!: Table<ProfilePieMenuData>;

  constructor() {
    super('myDatabase');

    // If a data column is array, you have to add * in front of it.
    this.version(1).stores({
      pieItem: '++id, name, enabled, *pieTaskContexts, iconBase64, useIconColor',
      // eslint-disable-next-line max-len
      pieMenu: '++id, name, enabled, activationMode, escapeRadius, openInScreenCenter, mainColor, secondaryColor, *pieItemIds, centerRadius, centerThickness, iconSize, pieItemRoundness, pieItemSpread',
      profile: '++id, name, enabled, *pieMenuIds, *exes, iconBase64',
      profilePieMenuData: '++id, [profileId+key], [profileId+pieMenuId], pieMenuId',
    });

    // Let IPC Main know that the database has changed
    Dexie.on('storagemutated', async (changedParts: ObservabilitySet) => {
      const changedPartsString = JSON.stringify(changedParts);
      if (changedPartsString.includes(`/pieMenuHotkeyMeta`) || changedPartsString.includes(`/profile/pieMenuIds`)){
        window.log.debug('Hotkey changed, sending IPC message to main process');

        window.dbAPI.possibleHotkeyChange(JSON.stringify(await this.profile.toArray()));
      }
    });
  }

  /**
   * Initializes the database with default values if no data is present.
   */
  async init() {
    window.log.info('Initializing/Loading app data');

    if ((await this.profile.count()) === 0) {
      window.log.info('No profile found, creating default profile');

      await this.pieItem.bulkPut([
        new PieItem('', 'PieItem 1'),
        new PieItem('', 'PieItem 2'),
        new PieItem('', 'PieItem 3'),
        new PieItem('', 'PieItem 4'),
        new PieItem('', 'PieItem 5'),
      ]);

      const defaultPieMenu = new PieMenu();
      defaultPieMenu.name = 'Default Pie Menu';
      defaultPieMenu.id = 1;
      defaultPieMenu.pieItemIds = [1, 2, 3, 4, 5];
      await this.pieMenu.put(defaultPieMenu);

      await this.profile.put(new Profile(
        'Default Profile',
        [],
        undefined,
        true,
        1
      ));

      await this.profilePieMenuData.put(new ProfilePieMenuData(
        1,
        1,
      ));

    }

    window.log.info('App data loaded');
  }

}
