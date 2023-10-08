import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NbDialogService, NbPosition} from '@nebular/theme';
import {PieletteDBHelper} from '../../../../../../app/src/db/PieletteDB';
import {PieMenu} from '../../../../../../app/src/db/data/PieMenu';

@Component({
  selector: 'app-pie-menu-list-row',
  templateUrl: './pie-menu-list-row.component.html',
  styleUrls: ['./pie-menu-list-row.component.scss']
})
export class PieMenuListRowComponent implements OnInit {
  @Input() pieMenu: PieMenu = new PieMenu();
  @Output() pieMenuChange = new EventEmitter<{ remove: number | undefined; add: number | undefined }>();
  @ViewChild('shortcutInput') shortcutInput: any;
  @ViewChild('nameInput') nameInput: any;
  @ViewChild('hotkeyAcquisitionDialog') confirmReplaceDialog: any;

  newHotkey = '';
  prevHotkey = '';

  nProfilesConnected = 1;

  protected readonly nbPosition = NbPosition;

  constructor(private dialogService: NbDialogService) {
  }

  updatePieMenu() {
    this.nameInput.nativeElement.blur();

    // this.pieMenu.selectionColor is auto updated in the color picker

    this.pieMenu.name = this.nameInput.nativeElement.value;
    PieletteDBHelper.pieMenu.put(this.pieMenu);
  }

  ngOnInit(): void {
    PieletteDBHelper.profile.where('pieMenus').equals(this.pieMenu.id ?? 0).count().then((count) => {
      this.nProfilesConnected = count;
    });
  }

  duplicatePieMenu() {
    if (this.nProfilesConnected > 1) {
      window.log.info('Duplicating pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ')');

      const newPieMenu = structuredClone(this.pieMenu);
      newPieMenu.id = undefined;
      PieletteDBHelper.pieMenu.add(newPieMenu).then((id) => {
        this.pieMenuChange.emit({remove: this.pieMenu.id, add: id as number});
      });
    }
  }

  acquireHotkey(success = true) {
    if (!success) {
      this.pieMenu.hotkey = this.prevHotkey;
      window.log.info('Hotkey of pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ') not changed per user request');
      return;
    }
    PieletteDBHelper.pieMenu.where('hotkey').equals(this.newHotkey)
      .modify((pieMenu: PieMenu) => pieMenu.hotkey = '')
      .then(() => {
        PieletteDBHelper.pieMenu.put(this.pieMenu);
        this.pieMenuChange.emit();
        window.log.info('Hotkey of pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ') changed to ' + this.newHotkey);
        window.log.info('All other pie menus with hotkey ' + this.newHotkey + ' had their hotkey removed');
      });
  }

  async shortcutInputChanged(newHotkey: string) {
    window.log.info('Trying to change hotkey of pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ') to ' + newHotkey);
    this.newHotkey = newHotkey;
    this.prevHotkey = this.pieMenu.hotkey;

    this.pieMenu.hotkey = newHotkey;

    if ((await PieletteDBHelper.pieMenu.where('hotkey').equals(newHotkey).count()) > 0) {
      this.dialogService.open(this.confirmReplaceDialog);
      window.log.info('Hotkey of pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ') already in use, ' +
        'prompting user to replace it');
    } else {
      PieletteDBHelper.pieMenu.put(this.pieMenu);
      window.log.info('Hotkey of pie menu ' + this.pieMenu.id + ' (name: ' + this.pieMenu.name + ') changed to ' + newHotkey);
    }
  }

  openPieMenuEditor(pieMenuId?: number) {
    if (pieMenuId === undefined) { return; }
    window.electronAPI.openPieMenuEditor(pieMenuId);
  }
}
