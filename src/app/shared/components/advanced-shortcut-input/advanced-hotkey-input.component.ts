import {ApplicationRef, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {NbDialogService} from '@nebular/theme';

export class AdvancedHotkeyValue {
  constructor(
    public ctrl = false,
    public alt = false,
    public shift = false,
    public key = '') {
  }
}

@Component({
  selector: 'app-advanced-hotkey-input',
  templateUrl: './advanced-hotkey-input.component.html',
  styleUrls: ['./advanced-hotkey-input.component.scss']
})
export class AdvancedHotkeyInputComponent {
  @Input() simpleView = false;

  // The type should be inline with the Hotkey class in pielette-core/Hotkey
  // But we can't import that class here in the frontend due to nodeIntegration: false.
  @Input() hotkey: AdvancedHotkeyValue = {ctrl: false, alt: false, shift: false, key: ''};
  @Output() hotkeyChange = new EventEmitter<{ ctrl: boolean; alt: boolean; shift: boolean; key: string }>();

  dialogOpened = false;

  options = [
    {
      label: 'LeftSuper',
      value: 'LeftSuper'
    }, {
      label: 'RightSuper',
      value: 'RightSuper'
    }, {
      label: 'F13',
      value: 'F13'
    }, {
      label: 'F14',
      value: 'F14'
    }, {
      label: 'F15',
      value: 'F15'
    }, {
      label: 'F16',
      value: 'F16'
    }, {
      label: 'F17',
      value: 'F17'
    }, {
      label: 'F18',
      value: 'F18'
    }, {
      label: 'F19',
      value: 'F19'
    }, {
      label: 'F20',
      value: 'F20'
    }, {
      label: 'F21',
      value: 'F21'
    }, {
      label: 'F22',
      value: 'F22'
    }, {
      label: 'F23',
      value: 'F23'
    }, {
      label: 'F24',
      value: 'F24'
    }, {
      label: 'NumPad0',
      value: 'NumPad0'
    }, {
      label: 'NumPad1',
      value: 'NumPad1'
    }, {
      label: 'NumPad2',
      value: 'NumPad2'
    }, {
      label: 'NumPad3',
      value: 'NumPad3'
    }, {
      label: 'NumPad4',
      value: 'NumPad4'
    }, {
      label: 'NumPad5',
      value: 'NumPad5'
    }, {
      label: 'NumPad6',
      value: 'NumPad6'
    }, {
      label: 'NumPad7',
      value: 'NumPad7'
    }, {
      label: 'NumPad8',
      value: 'NumPad8'
    }, {
      label: 'NumPad9',
      value: 'NumPad9'
    }, {
      label: 'Grave',
      value: 'Grave'
    }, {
      label: 'Minus',
      value: 'Minus'
    }, {
      label: 'Equal',
      value: 'Equal'
    }, {
      label: 'LeftBracket',
      value: 'LeftBracket'
    }, {
      label: 'RightBracket',
      value: 'RightBracket'
    }, {
      label: 'Backslash',
      value: 'Backslash'
    }, {
      label: 'Semicolon',
      value: 'Semicolon'
    }, {
      label: 'Quote',
      value: 'Quote'
    }, {
      label: 'Comma',
      value: 'Comma'
    }, {
      label: 'Period',
      value: 'Period'
    }, {
      label: 'Slash',
      value: 'Slash'
    }, {
      label: 'Print',
      value: 'Print'
    }, {
      label: 'Pause',
      value: 'Pause'
    }, {
      label: 'Insert',
      value: 'Insert'
    }, {
      label: 'Delete',
      value: 'Delete'
    }, {
      label: 'Home',
      value: 'Home'
    }, {
      label: 'End',
      value: 'End'
    }, {
      label: 'PageUp',
      value: 'PageUp'
    }, {
      label: 'PageDown',
      value: 'PageDown'
    }, {
      label: 'Add',
      value: 'Add'
    }, {
      label: 'Subtract',
      value: 'Subtract'
    }, {
      label: 'Multiply',
      value: 'Multiply'
    }, {
      label: 'Divide',
      value: 'Divide'
    }, {
      label: 'Decimal',
      value: 'Decimal'
    }, {
      label: 'AudioMute',
      value: 'AudioMute'
    }, {
      label: 'AudioVolDown',
      value: 'AudioVolDown'
    }, {
      label: 'AudioVolUp',
      value: 'AudioVolUp'
    }, {
      label: 'AudioPlay',
      value: 'AudioPlay'
    }, {
      label: 'AudioStop',
      value: 'AudioStop'
    }, {
      label: 'AudioPause',
      value: 'AudioPause'
    }, {
      label: 'AudioPrev',
      value: 'AudioPrev'
    }, {
      label: 'AudioNext',
      value: 'AudioNext'
    }, {
      label: 'AudioRewind',
      value: 'AudioRewind'
    }, {
      label: 'AudioForward',
      value: 'AudioForward'
    }, {
      label: 'AudioRepeat',
      value: 'AudioRepeat'
    }, {
      label: 'AudioRandom',
      value: 'AudioRandom'
    }, {
      label: 'LeftWin',
      value: 'LeftWin'
    }, {
      label: 'RightWin',
      value: 'RightWin'
    }, {
      label: 'LeftCmd',
      value: 'LeftCmd'
    }, {
      label: 'RightCmd',
      value: 'RightCmd'
    }, {
      label: 'Menu',
      value: 'Menu'
    }, {
      label: 'Fn',
      value: 'Fn'
    }];

  constructor(private appRef: ApplicationRef,
              private dialogService: NbDialogService) {
    // exePath is "" in EditorWindow
    window.system.onKeyDown((exePath, ctrl = false, alt = false, shift = false, key) => {
      if (!this.dialogOpened) {
        return;
      }
      if (ctrl !== this.hotkey.ctrl || alt !== this.hotkey.alt || shift !== this.hotkey.shift || key !== this.hotkey.key) {
        this.hotkey.ctrl = ctrl;
        this.hotkey.alt = alt;
        this.hotkey.shift = shift;
        this.hotkey.key = key;

        this.hotkeyChange.emit(this.hotkey);

        appRef.tick();
      }

    });
  }

  openAdvancedHotkeyInput(dialog: TemplateRef<any>) {
    this.dialogOpened = true;
    this.dialogService.open(dialog, {
      context: {
        title: 'This is a title passed to the dialog component',
      },
    }).onClose.subscribe(() => {
      this.dialogOpened = false;
    });
  }
}
