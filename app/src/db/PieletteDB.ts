import Dexie, {Table} from "dexie";
import {PieItem} from "./data/PieItem";
import {PieMenu} from "./data/PieMenu";
import {Profile} from "./data/Profile";


// TODO: Create as a service
export class PieletteDB extends Dexie {
  pieItem!: Table<PieItem>;
  pieMenu!: Table<PieMenu>;
  profile!: Table<Profile>;

  initialized = false;

  constructor() {
    super('myDatabase');

    // If a data column is array, you have to add * in front of it.
    this.version(1).stores({
      pieItem: "++id, name, enabled, *pieTaskContexts, iconBase64, useIconColor",
      pieMenu: "++id, name, enabled, activationMode, hotkey, escapeRadius, openInScreenCenter, mainColor, secondaryColor, *pieItemIds, centerRadius, centerThickness, iconSize, pieItemRoundness, pieItemSpread",
      profile: "++id, name, enabled, *pieMenuIds, *exes, iconBase64",
    });

    Dexie.on('storagemutated', () => {
      window.dbAPI.possibleHotkeyChange(['lskdjf']);
    });
  }

  async init() {
    if (this.initialized) {
      return;
    }

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
      const pieMenuId = await this.pieMenu.put(defaultPieMenu);

      await this.profile.put(new Profile(
        'Default Profile',
        [pieMenuId as number],
        [],
        undefined,
        true,
        1
      ));

    }

    this.pieMenu.each((pieMenu) => {
      window.electronAPI.addHotkey(pieMenu.hotkey, pieMenu.id ?? -1);
    });

    this.initialized = true;
    window.log.info('App data loaded');
  }

}

export const PieletteDBHelper = new PieletteDB();
