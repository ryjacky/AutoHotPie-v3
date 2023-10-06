import {Component, Input} from '@angular/core';
import {PieSingleTaskContext} from '../../../../app/src/actions/PieSingleTaskContext';
import {ToastrService} from 'ngx-toastr';
import {PieMenuService} from '../../core/services/pieMenu/pie-menu.service';

@Component({
  selector: 'app-pie-menu-editor',
  templateUrl: './pie-menu-editor.component.html',
  styleUrls: ['./pie-menu-editor.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuEditorComponent {
  @Input() pieMenuId: number;

  // pieMenuStateLoaded is used to prevent the work area from loading until the pie menu state has created.
  // pieMenuStateLoaded?: Promise<boolean>;
  activePieItemId: number | undefined;
  pieMenuService: PieMenuService;

  constructor(private toastr: ToastrService, pieMenuService: PieMenuService) {
    this.pieMenuService = pieMenuService;
    this.pieMenuId = parseInt(new URL(window.location.href.replace('#/', '')).searchParams.get('pieMenuId') ?? '0', 10);

    window.log.debug('Pie Menu Editor is opening pie menu of id: ' + this.pieMenuId);

    this.loadWorkArea(this.pieMenuId);
  }

  async loadWorkArea(pieMenuId: number) {

    await this.pieMenuService.load(pieMenuId);

    window.log.warn('Map objects (pieItems) cannot be serialized to JSON');
    window.log.warn('Pie menu state: ' + JSON.stringify(this.pieMenuService));

    this.activePieItemId = this.pieMenuService.pieItemIds[0];
    // this.pieMenuStateLoaded = Promise.resolve(true);
  }

  moveUp(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuService.getPieItemActions(this.activePieItemId ?? -1);
    if (i > 0) {
      const temp = actions[i - 1];
      actions[i - 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuService.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  moveDown(i: number) {
    if (!this.isStateOperable()) { return; }

    const actions = this.pieMenuService.getPieItemActions(this.activePieItemId ?? -1);

    if (i < actions.length - 1) {
      const temp = actions[i + 1];
      actions[i + 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuService.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  deleteAction(i: number) {
    if (!this.isStateOperable()) { return; }

    if (this.pieMenuService.getPieItemActions(this.activePieItemId ?? -1).length ?? 0 > 0) {
      this.pieMenuService.getPieItemActions(this.activePieItemId ?? -1).splice(i, 1);
    }
  }

  addAction() {
    if (!this.isStateOperable()) { return; }

    this.pieMenuService.getPieItemActions(this.activePieItemId ?? -1).push(new PieSingleTaskContext('ahp-send-key', {}));
  }

  isStateOperable(): boolean{
    if (this.activePieItemId === undefined || !this.pieMenuService || !this.pieMenuService.hasPieItem(this.activePieItemId)) {
      window.log.error('Either selectedPieItemId or pieMenuState.pieItems is undefined');
      window.log.error('selectedPieItemId: ' + this.activePieItemId);
      // window.log.error('pieMenuState.pieItems: ' + this.pieMenuState?.pieItems);
      return false;
    }
    if (!this.pieMenuService.hasPieItem(this.activePieItemId)) {
      window.log.error(`Pie menu state for pie item ${this.activePieItemId} is undefined`);

      return false;
    }

    return true;
  }

  save() {
    if (!this.isStateOperable()) { return; }

    this.pieMenuService.save();
    this.toastr.success('', 'Saved!', {timeOut: 1000, positionClass: 'toast-bottom-right'});
  }
}
