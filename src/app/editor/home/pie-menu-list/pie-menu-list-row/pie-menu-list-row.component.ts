import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogService, NbPosition} from '@nebular/theme';
import {ProfileService} from '../../../../core/services/profile/profile.service';
import {PieletteDBHelper} from '../../../../../../app/src/db/PieletteDB';
import {MouseKeyEvent, PieMenu} from '../../../../../../app/src/db/data/PieMenu';
import {MouseKeyEventHelper} from '../../../../../../app/src/mouseKeyEvent/MouseKeyEventHelper';

@Component({
  selector: 'app-pie-menu-list-row',
  templateUrl: './pie-menu-list-row.component.html',
  styleUrls: ['./pie-menu-list-row.component.scss']
})
export class PieMenuListRowComponent implements OnInit {
  @Input() pieMenuId = 0;
  @ViewChild('shortcutInput') shortcutInput: any;
  @ViewChild('nameInput') nameInput: any;
  @ViewChild('hotkeyAcquisitionDialog') confirmReplaceDialog: any;
  newHotkey: MouseKeyEvent = MouseKeyEventHelper.emptyMouseKeyEvent();

  protected readonly nbPosition = NbPosition;

  constructor(
    private dialogService: NbDialogService,
    public profileService: ProfileService,
  ) {
  }

  updatePieMenu() {
    this.nameInput.nativeElement.blur();

    this.profileService.setPieMenuName(this.pieMenuId, this.nameInput.nativeElement.value);
  }

  ngOnInit(): void {
  }


  robHotkeyFromOtherProfiles(success = true) {
    // Rob the hotkey from other pie menu
    if (!success) {
      return;
    }
    PieletteDBHelper.pieMenu.where('hotkeyEncoded').equals(this.newHotkey)
      .modify((pieMenu: PieMenu) => pieMenu.hotkey = MouseKeyEventHelper.emptyMouseKeyEvent())
      .then(() => {
        this.profileService.setPieMenuHotkey(this.pieMenuId, this.newHotkey);
      });
  }

  async shortcutInputChanged(newHotkey: MouseKeyEvent) {
    window.log.info('Trying to change hotkey of pie menu to ' + newHotkey);
    this.newHotkey = newHotkey;

    if ((await PieletteDBHelper.pieMenu.where('hotkeyEncoded').equals(newHotkey).count()) > 0) {
      this.dialogService.open(this.confirmReplaceDialog);
    } else {
      this.profileService.setPieMenuHotkey(this.pieMenuId, newHotkey);
    }
  }

  openPieMenuEditor(pieMenuId?: number) {
    if (pieMenuId === undefined) { return; }
    window.electronAPI.openPieMenuEditor(pieMenuId);
  }

}
