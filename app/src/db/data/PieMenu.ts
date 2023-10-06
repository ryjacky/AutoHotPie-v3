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
  selectionColor: string;
  pieItemIds: number[];
  id?: number;
}

export class PieMenu implements IPieMenu {
  constructor(
    public name = "New Pie Menu",
    public enabled = true,
    public activationMode = PieMenuActivationMode.HOVER_OVER_THEN_RELEASE,
    public hotkey = '',
    public escapeRadius = 0,
    public openInScreenCenter = false,
    public selectionColor = '#1DAEAA',
    public pieItemIds: number[] = [],
    public id?: number
  ) {}
}
