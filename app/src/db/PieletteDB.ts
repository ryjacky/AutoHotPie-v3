import Dexie, {Table} from "dexie";
import {PieItem} from "./data/PieItem";
import {PieMenu} from "./data/PieMenu";
import {Profile} from "./data/Profile";

export interface IPieletteDB {
  pieItem: Table<PieItem>;
  pieMenu: Table<PieMenu>;
  profile: Table<Profile>;
}

export class PieletteDB extends Dexie implements IPieletteDB {
  pieItem!: Table<PieItem>;
  pieMenu!: Table<PieMenu>;
  profile!: Table<Profile>;

  constructor() {
    super('myDatabase');

    // If a data column is array, you have to add * in front of it.
    this.version(1).stores({
      pieItem: "++id, name, enabled, *pieTaskContexts, iconBase64, useIconColor",
      pieMenu: "++id, name, enabled, activationMode, hotkey, escapeRadius, openInScreenCenter, selectionColor, *pieItemIds",
      profile: "++id, name, enabled, *pieMenus, *exes, iconBase64",
    });
  }
}

export const PieletteDBHelper = new PieletteDB();
