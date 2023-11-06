import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PieSingleTaskContext} from '../../../../app/src/actions/PieSingleTaskContext';
import {ToastrService} from 'ngx-toastr';
import {PieMenuService} from '../../core/services/pieMenu/pie-menu.service';
import {NbDialogService} from '@nebular/theme';
import {NbIconPickerComponent} from '../../shared/components/nb-icon-picker/nb-icon-picker.component';
import {ActivatedRoute} from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialogService: NbDialogService,
    public pieMenuService: PieMenuService) {
    this.pieMenuId = Number(route.snapshot.paramMap.get('pieMenuId'));

    window.log.debug('Pie Menu Editor is opening pie menu of id: ' + this.pieMenuId);

  }

  ngOnInit() {
    this.loadWorkArea(this.pieMenuId);

  }

  async loadWorkArea(pieMenuId: number) {
    await this.pieMenuService.forceLoad(pieMenuId);
    this.activePieItemId = this.pieMenuService.pieItemIds[0];

    window.log.warn('Map objects (pieItems) cannot be serialized to JSON');
  }

  moveUp(i: number) {
    this.pieMenuService.movePieTaskUp(this.activePieItemId ?? -1, i);
  }

  moveDown(i: number) {
    this.pieMenuService.movePieTaskDown(this.activePieItemId ?? -1, i);
  }

  deleteAction(i: number) {
    this.pieMenuService.deletePieTask(this.activePieItemId ?? -1, i);
  }

  addPieItemContext() {
    this.pieMenuService.addPieItemTaskContext(
      this.activePieItemId ?? -1,
      new PieSingleTaskContext(
        'ahp-send-key',
        {}
      ));
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
      this.openIconSelector(pieItemId);
    }
  }

  async openIconSelector(pieItemId: number) {
    this.dialogService.open(NbIconPickerComponent, {
    }).onClose.subscribe(icon => {
      window.log.debug('Icon selected: ' + icon);

      if (icon === undefined) { return; }

      const pieItem = this.pieMenuService.pieItems.get(pieItemId ?? -1);
      if (pieItem !== undefined) {
        pieItem.iconBase64 = icon;
      }
    });

  }
}
