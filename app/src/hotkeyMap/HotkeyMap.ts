export class HotkeyToPieMenuIdMap extends Map<string, number> {
  /**
   * @deprecated Use addPieMenuId() instead
   */
  set(key: string, value: number) {
    throw new Error('Use addPieMenuId() instead')
    return this;
  }

  get(key: string): undefined {
    return undefined;
  }

  addPieMenuId(ctrl: boolean, alt: boolean, shift: boolean, key: string, profId: number, value: number) {
    super.set(this.getKeyString(ctrl, alt, shift, key, profId), value);
  }

  hasHotkey(ctrl: boolean, alt: boolean, shift: boolean, key: string, profId: number): boolean {
    return super.has(this.getKeyString(ctrl, alt, shift, key, profId));
  }

  getPieMenuId(ctrl: boolean, alt: boolean, shift: boolean, key: string, profId: number): number | undefined {
    return super.get(this.getKeyString(ctrl, alt, shift, key, profId));
  }

  getKeyString(ctrl: boolean, alt: boolean, shift: boolean, key: string, profId: number): string {
    return `${ctrl}+${alt}+${shift}+${key}+${profId}`;
  }
}
