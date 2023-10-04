import {OnExecutedArgs} from "pielette-core";

export class PieTaskContext {
  constructor(
    public addonId: string,
    public args: OnExecutedArgs,
  ) {
  }
}
