import Dexie, {Table} from "dexie";
import {PieItem} from "./data/PieItem";
import {PieMenu} from "./data/PieMenu";
import {Profile} from "./data/Profile";

export class PieletteDB extends Dexie {
  pieItem!: Table<PieItem>;
  pieMenu!: Table<PieMenu>;
  profile!: Table<Profile>;

  constructor() {
    super('myDatabase');

    // If a data column is array, you have to add * in front of it.
    this.version(1).stores({
      pieItem: "++id, name, enabled, *pieTaskContexts, iconBase64, useIconColor",
      pieMenu: "++id, name, enabled, activationMode, hotkey, escapeRadius, openInScreenCenter, mainColor, secondaryColor, *pieItemIds, centerRadius, centerThickness, iconSize, pieItemRoundness, pieItemSpread",
      profile: "++id, name, enabled, *pieMenuIds, *exes, iconBase64",
    });
  }
}

export const PieletteDBHelper = new PieletteDB();
