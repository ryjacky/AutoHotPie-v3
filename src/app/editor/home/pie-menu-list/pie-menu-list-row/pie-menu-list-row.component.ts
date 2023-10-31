import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogService, NbPosition} from '@nebular/theme';
import {ProfileService} from '../../../../core/services/profile/profile.service';

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
  newHotkey: KeyboardEvent = new KeyboardEvent('keydown');
  currentHotkey: KeyboardEvent = new KeyboardEvent('keydown');

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

  async ngOnInit() {
    this.currentHotkey = await this.profileService.getHotkey(this.pieMenuId);
    window.log.debug('Current hotkey of pie menu ' + this.pieMenuId + ' is ' + this.currentHotkey);
  }


  robHotkeyFromOtherProfiles(success = true) {
    // Rob the hotkey from other pie menu
    if (!success) {
      return;
    }

    this.profileService.setPieMenuHotkey(
      this.pieMenuId,
      this.newHotkey.ctrlKey,
      this.newHotkey.shiftKey,
      this.newHotkey.altKey,
      this.newHotkey.key)
      .then(() => {this.currentHotkey = this.newHotkey;});
  }

  async shortcutInputChanged(newHotkey: KeyboardEvent) {
    window.log.info('Trying to change hotkey of pie menu to ' + newHotkey);
    this.newHotkey = newHotkey;

    if (!await this.profileService.isHotkeyAvailable(
      newHotkey.ctrlKey,
      newHotkey.shiftKey,
      newHotkey.altKey,
      newHotkey.key)) {
      this.dialogService.open(this.confirmReplaceDialog);
    } else {
      this.currentHotkey = newHotkey;
      await this.profileService.setPieMenuHotkey(
        this.pieMenuId,
        newHotkey.ctrlKey,
        newHotkey.shiftKey,
        newHotkey.altKey,
        newHotkey.key);
    }
  }

  openPieMenuEditor(pieMenuId?: number) {
    if (pieMenuId === undefined) { return; }
    window.electronAPI.openPieMenuEditor(pieMenuId);
  }
}
