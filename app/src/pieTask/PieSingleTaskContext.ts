
export class PieSingleTaskContext {
  constructor(
    public addonId: string,
    public params: Record<string, any>,
    public delay: number = 0,
    public repeat: number = 1,
  ) {
  }
}
