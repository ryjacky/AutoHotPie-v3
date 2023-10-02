import {Action} from "../actions/Action";

export class PieItem {
  constructor(
    public iconBase64: string,
    public name = "New Pie Item",
    public enabled = true,
    public actions: Action[] = [],
    public useIconColor = true,
    public id?: number
  ) {}
}
