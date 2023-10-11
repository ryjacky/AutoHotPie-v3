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
  hotkeyEncoded: string;
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
    public hotkeyEncoded = '',
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
