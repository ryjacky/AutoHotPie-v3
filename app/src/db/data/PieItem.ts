import {PieSingleTaskContext} from "../../actions/PieSingleTaskContext";

export interface IPieItem {
  iconBase64: string;
  name: string;
  enabled: boolean;
  pieTaskContexts: PieSingleTaskContext[];
  useIconColor: boolean;
  id?: number;
}

export class PieItem {
  constructor(
    public iconBase64: string,
    public name = "New Pie Item",
    public enabled = true,
    public pieTaskContexts: PieSingleTaskContext[] = [],
    public useIconColor = true,
    public id?: number
  ) {}
}
