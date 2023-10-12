import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PieSingleTaskContext} from '../../../../app/src/actions/PieSingleTaskContext';
import {ToastrService} from 'ngx-toastr';
import {PieMenuService} from '../../core/services/pieMenu/pie-menu.service';

/**
 * TODO: This class is giving errors when loaded, and optimization is needed, it does not affect UX.
 */
@Component({
  selector: 'app-pie-menu-editor',
  templateUrl: './pie-menu-editor.component.html',
  styleUrls: ['./pie-menu-editor.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuEditorComponent implements OnInit {
  @Input() pieMenuId: number;

  @ViewChild('pieButtons') pieButtons: any;

  activePieItemId: number | undefined;
  pieMenuService: PieMenuService;

  constructor(private toastr: ToastrService, pieMenuService: PieMenuService) {
    this.pieMenuService = pieMenuService;
    this.pieMenuId = parseInt(new URL(window.location.href.replace('#/', '')).searchParams.get('pieMenuId') ?? '0', 10);

    window.log.debug('Pie Menu Editor is opening pie menu of id: ' + this.pieMenuId);

  }

  ngOnInit() {
    this.loadWorkArea(this.pieMenuId);

  }

  async loadWorkArea(pieMenuId: number) {
    await this.pieMenuService.load(pieMenuId, true);
    this.activePieItemId = this.pieMenuService.pieItemIds[0];

    window.log.warn('Map objects (pieItems) cannot be serialized to JSON');
    window.log.warn('Pie menu state: ' + JSON.stringify(this.pieMenuService));
    // this.pieMenuStateLoaded = Promise.resolve(true);
  }

  moveUp(i: number) {
    const actions = this.pieMenuService.getPieItemTaskContexts(this.activePieItemId ?? -1);
    if (i > 0) {
      const temp = actions[i - 1];
      actions[i - 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuService.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  moveDown(i: number) {
    const actions = this.pieMenuService.getPieItemTaskContexts(this.activePieItemId ?? -1);

    if (i < actions.length - 1) {
      const temp = actions[i + 1];
      actions[i + 1] = actions[i];
      actions[i] = temp;
    }

    this.pieMenuService.setPieItemActions(this.activePieItemId ?? -1, actions);
  }

  deleteAction(i: number) {
    if (this.pieMenuService.getPieItemTaskContexts(this.activePieItemId ?? -1).length ?? 0 > 0) {
      this.pieMenuService.getPieItemTaskContexts(this.activePieItemId ?? -1).splice(i, 1);
    }
  }

  addPieItemContext() {
    this.pieMenuService.getPieItemTaskContexts(this.activePieItemId ?? -1).push(
      new PieSingleTaskContext(
        'ahp-send-key',
        {}
      ));
  }

  save() {
    this.pieMenuService.save();
    this.toastr.success('', 'Saved!', {timeOut: 1000, positionClass: 'toast-bottom-right'});
  }

  addPieItem() {
    this.pieMenuService.addEmptyPieItem().then(() => {
      this.pieButtons?.ngOnChanges();
    });
  }

  removePieItem(pieItemId: number) {
    if (this.pieMenuService.pieItemIds.length <= 1) {
      this.toastr.error('', 'No! Don\'t remove the last one!', {timeOut: 1000, positionClass: 'toast-bottom-right'});
      return;
    }
    this.pieMenuService.removePieItem(pieItemId ?? -1);
    this.activePieItemId = this.pieMenuService.pieItemIds[0];
  }

  setPieItemName(event: Event, pieItemId: number) {
    const pieItem = this.pieMenuService.pieItems.get(pieItemId);
    if (pieItem === undefined) { return; }

    pieItem.name = (event.target as HTMLInputElement).value;
  }

  setPieItemIcon(event: Event, pieItemId: number) {
    if ((event as MouseEvent).altKey){
      this.pieMenuService.removeIconAtPieItem(pieItemId);
    } else {
      this.openIconSelector();
    }
  }

  async openIconSelector() {
    const filePath = String(await window.electronAPI.openDialogForResult(
      '%appdata%\\Pielette\\Icons',
      [{name: 'All', extensions: ['*']}]));

    const fileName = filePath.split('\\').pop()?.split('/').pop() ?? '';
    let icon;

    if (fileName.startsWith('[eva]') && fileName.endsWith('.png')) {
      window.log.debug('Icon is native');
      icon = fileName.replace('.png', '');
    } else {
      // Seems like the file path is not a string (or maybe a "fake" string), we have to convert it to string manually
      icon = await window.electronAPI.getFileIconBase64(filePath);
      window.log.debug('Icon is not native');
    }

    const pieItem = this.pieMenuService.pieItems.get(this.activePieItemId ?? -1);
    if (pieItem !== undefined) {
      pieItem.iconBase64 = icon;
    }

  }
}
