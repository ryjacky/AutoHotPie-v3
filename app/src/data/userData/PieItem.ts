import {ActionDelegate} from "../actions/ActionDelegate";

export class PieItem {
  constructor(
    public iconBase64: string,
    public name = "New Pie Item",
    public enabled = true,
    public actions: ActionDelegate[] = [],
    public useIconColor = true,
    public id?: number
  ) {}
}
