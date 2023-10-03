import {OnExecutedArgs} from "pielette-core";

export class ActionDelegate {
  constructor(
    public pluginId: string,
    public parameters: OnExecutedArgs,
  ) {
  }
}
