import {Component, OnInit} from '@angular/core';
import {PieMenuState, PieMenuStateManager} from '../state/PieMenuState';
import {ActionDelegate} from '../../../../app/src/actions/ActionDelegate';

@Component({
  selector: 'app-work-area-component',
  templateUrl: './work-area.component.html',
  styleUrls: ['./work-area.component.scss']
})
export class WorkAreaComponent implements OnInit {
  pieMenuState: PieMenuState = PieMenuStateManager.instance.activePieMenuState;
  activePieItemId: number | undefined;

  ngOnInit(): void {
    this.activePieItemId = this.pieMenuState.pieMenu.pieItemIds[0];
  }

  moveUp(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1);
    if (i > 0) {
      const temp = actions[i - 1];
      actions[i - 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuState.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  moveDown(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1);

    if (i < actions.length - 1) {
      const temp = actions[i + 1];
      actions[i + 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuState.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  deleteAction(i: number) {
    if (!this.isStateOperable()) { return; }

    if (this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).length ?? 0 > 0) {
      this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).splice(i, 1);
    }
  }

  addAction() {
    if (!this.isStateOperable()) { return; }

    this.pieMenuState.getPieItemActions(this.activePieItemId ?? -1).push(new ActionDelegate('ahp-send-key', {}));
  }

  isStateOperable(): boolean{
    if (this.activePieItemId === undefined || this.pieMenuState.pieItems.get(this.activePieItemId) === undefined) {
      window.log.error('Either selectedPieItemId or pieMenuState.pieItems is undefined');
      window.log.error('selectedPieItemId: ' + this.activePieItemId);
      window.log.error('pieMenuState.pieItems: ' + this.pieMenuState.pieItems);
      return false;
    }
    if (this.pieMenuState.pieItems.get(this.activePieItemId) === undefined) {
      window.log.error(`Pie menu state for pie item ${this.activePieItemId} is undefined`);

      return false;
    }

    return true;
  }
}
