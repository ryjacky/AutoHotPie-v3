"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.AHPDatabase = void 0;
const dexie_1 = require("dexie");
class AHPDatabase extends dexie_1.default {
    constructor() {
        super('myDatabase');
        // If a data column is array, you have to add * in front of it.
        this.version(1).stores({
            pieItem: "++id, name, enabled, *actions, iconPath, useIconColor",
            pieMenu: "++id, name, enabled, activationMode, hotkey, escapeRadius, openInScreenCenter, selectionColor, *pieItems",
            profile: "++id, name, enabled, *pieMenus, *exes, iconBase64",
        });
    }
}
exports.AHPDatabase = AHPDatabase;
exports.db = new AHPDatabase();
//# sourceMappingURL=AHPDatabase.js.map