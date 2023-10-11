import {RuntimeArgs} from "pielette-core";

export class PieSingleTaskContext {
  constructor(
    public addonId: string,
    public args: RuntimeArgs,
    public delay: number = 0,
    public repeat: number = 1,
  ) {
  }

  public get copy(): PieSingleTaskContext {
    return new PieSingleTaskContext(
      this.addonId,
      this.args
    );
  }
}
