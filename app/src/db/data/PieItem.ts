import {PieTaskContext} from "../../actions/PieTaskContext";

export class PieItem {
  constructor(
    public iconBase64: string,
    public name = "New Pie Item",
    public enabled = true,
    public pieTaskContexts: PieTaskContext[] = [],
    public useIconColor = true,
    public id?: number
  ) {}
}
