import {Schema} from "electron-store";
import {app} from "electron";
import * as Store from "electron-store";
import {KeyEvent, RespondType} from "mousekeyhook.js";
import {PieletteEnv} from "pielette-core/lib/PieletteEnv";

interface IPieletteSettingSchema {
  pieMenuCancelKey: string;
  runOnStartup: boolean;
  runOnAppQuit: boolean;
  plugins: string[];
}

const PieletteSettingSchema: Schema<IPieletteSettingSchema> = {
  pieMenuCancelKey: {
    type: 'string',
    default: JSON.stringify(new KeyEvent(RespondType.MOUSE_DOWN, 'Escape'))
  },
  runOnStartup: {
    type: 'boolean',
    default: true
  },
  runOnAppQuit: {
    type: 'boolean',
    default: true
  },
  plugins: {
    type: 'array',
    items: {
      type: 'string'
    },
    default: [
      'pielette-addon-sendkeys',
    ]
  }
};

// Set the path of the settings file to be in the db folder of AHPv3
// This is to ensure the path is correct no matter when ahpSettings is initialized
app.setPath("userData", PieletteEnv.DEFAULT_DATA_PATH);

/**
 * ahpSettings.get('') will return the value of the key
 * ahpSettings.set('', [value]) will set the value of the key
 * Details could be found here: https://github.com/sindresorhus/electron-store#readme
 */
export const PieletteSettings = new Store<IPieletteSettingSchema>({
  schema: PieletteSettingSchema, migrations: {
    '3.0.2': (store) => {
      store.set('pieMenuCancelKey', JSON.stringify(new KeyEvent(RespondType.KEY_DOWN, 'Escape')));
    }
  }
});
