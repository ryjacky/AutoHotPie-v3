import {MouseKeyEventObject} from "../../mouseKeyEvent/MouseKeyEventObject";

/**
 * Represents a mouse or keyboard event.
 * - [0] eventName: The name of the event.
 * - [1] input: The input of the event. For example, if the event is a keyboard event, this field will be the key that is pressed.
 * - [2] x: The x coordinate of the mouse event.
 * - [3] y: The y coordinate of the mouse event.
 * - [4] shift: Whether the shift key is pressed.
 * - [5] control: Whether the control key is pressed.
 * - [6] alt: Whether the alt key is pressed.
 *
 * We choose to use an array instead of a class because it may cause less confusion when we pass it around, and
 * it is directly compatible with the database.
 */
export type MouseKeyEvent = any[];

export enum PieMenuActivationMode {
  RELEASE_THEN_HOVER_OVER = "releaseThenHoverOver",
  HOVER_OVER_THEN_RELEASE = "hoverOverThenRelease",
  HOVER_OVER_ALL = "hoverOverAll",
  CLICK = "click"
}

export interface IPieMenu {
  name: string;
  enabled: boolean;
  activationMode: PieMenuActivationMode;
  hotkey: string;
  escapeRadius: number;
  openInScreenCenter: boolean;
  mainColor: string;
  secondaryColor: string;
  iconColor: string;
  iconSize: number;
  centerRadius: number;
  centerThickness: number;
  pieItemSpread: number;
  pieItemRoundness: number;
  pieItemIds: number[];
  pieItemWidth: number;
  id?: number;
}

export class PieMenu implements IPieMenu {
  constructor(
    public name = "New Pie Menu",
    public enabled = true,
    public activationMode = PieMenuActivationMode.HOVER_OVER_THEN_RELEASE,
    public hotkey = MouseKeyEventObject.createString(),
    public escapeRadius = 0,
    public openInScreenCenter = false,
    public mainColor = '#1DAEAA',
    public secondaryColor: string = '#282828',
    public iconColor: string = '#FFFFFF',
    public pieItemIds: number[] = [],
    public centerRadius: number = 20,
    public centerThickness: number = 10,
    public pieItemWidth: number = 100,
    public iconSize: number = 16,
    public pieItemRoundness: number = 7,
    public pieItemSpread: number = 150,
    public id?: number
  ) {
    // We cannot use name parameter due to the limitation of dexie.js
  }


}
