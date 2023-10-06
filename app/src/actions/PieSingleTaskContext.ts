import {OnExecutedArgs} from "pielette-core";

export class PieSingleTaskContext {
  constructor(
    public addonId: string,
    public args: OnExecutedArgs,
  ) {
  }

  public get copy(): PieSingleTaskContext {
    return new PieSingleTaskContext(
      this.addonId,
      this.args
    );
  }
}
