import {PieMenu} from '../../../../../app/src/db/data/PieMenu';
import {PieItem} from '../../../../../app/src/db/data/PieItem';
import {PieletteDBHelper} from '../../../../../app/src/db/PieletteDB';
import {PieTaskContext} from '../../../../../app/src/actions/PieTaskContext';

export class PieMenuState {
  constructor(
    private pieMenu: PieMenu,
    private pieItems: Map<number, PieItem>,
  ) {
  }

  public get pieMenuItemIds(): number[] {
    return this.pieMenu.pieItemIds;
  }

  public getPieTaskContext(pieItemId: number): PieTaskContext[] | undefined {
    return this.pieItems.get(pieItemId)?.pieTaskContexts;
  }

  public hasPieItem(id: number): boolean {
    return this.pieItems.get(id) !== undefined;
  }

  public getPieItemActions(id: number): PieTaskContext[] {
    return this.pieItems.get(id)?.pieTaskContexts ?? [];
  }

  public setPieItemActions(id: number, actions: PieTaskContext[]) {
    if (this.pieItems.get(id) === undefined) {
      return;
    }

    // this.pieItems.get(id)?.actions must not be undefined
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    this.pieItems.get(id)!.pieTaskContexts = actions;
  }

  public save() {
    window.log.debug('Saving pie menu state: ' + JSON.stringify(this));
    PieletteDBHelper.pieMenu.update(this.pieMenu.id ?? -1, {pieItems: this.pieMenu.pieItemIds});

    for (const pieItem of this.pieItems.values()) {
      PieletteDBHelper.pieItem.put(pieItem, pieItem.id);
    }
  }
}
