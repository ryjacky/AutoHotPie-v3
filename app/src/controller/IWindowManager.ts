import {BrowserWindow} from "electron";

export interface IWindowManager {
  window?: BrowserWindow;
  init(): void;
  show(): void;
  hide(): void;
}
