
export class PieSingleTaskContext {
  constructor(
    public addonId: string,
    public args: any,
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
