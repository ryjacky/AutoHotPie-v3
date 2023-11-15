import {ApplicationRef, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-advanced-shortcut-input',
  templateUrl: './advanced-shortcut-input.component.html',
  styleUrls: ['./advanced-shortcut-input.component.scss']
})
export class AdvancedShortcutInputComponent {
  @Input() simpleView = false;

  // The type should be inline with the Hotkey class in pielette-core/Hotkey
  // But we can't import that class here in the frontend due to nodeIntegration: false.
  @Input() hotkey = {ctrl: false, alt: false, shift: false, key: ''};
  @Output() hotkeyChange = new EventEmitter<{ctrl: boolean; alt: boolean; shift: boolean; key: string}>();

  dialogOpened = false;

  options = [
    {
    label: 'Space',
    value:  0
  }, {
    label: 'Escape',
    value:  1
  }, {
    label: 'Tab',
    value:  2
  },{
    label: 'LeftSuper',
    value:  8
  }, {
    label: 'RightSuper',
    value:  10
  }, {
    label: 'F1',
    value:  11
  }, {
    label: 'F2',
    value:  12
  }, {
    label: 'F3',
    value:  13
  }, {
    label: 'F4',
    value:  14
  }, {
    label: 'F5',
    value:  15
  }, {
    label: 'F6',
    value:  16
  }, {
    label: 'F7',
    value:  17
  }, {
    label: 'F8',
    value:  18
  }, {
    label: 'F9',
    value:  19
  }, {
    label: 'F10',
    value:  20
  }, {
    label: 'F11',
    value:  21
  }, {
    label: 'F12',
    value:  22
  }, {
    label: 'F13',
    value:  23
  }, {
    label: 'F14',
    value:  24
  }, {
    label: 'F15',
    value:  25
  }, {
    label: 'F16',
    value:  26
  }, {
    label: 'F17',
    value:  27
  }, {
    label: 'F18',
    value:  28
  }, {
    label: 'F19',
    value:  29
  }, {
    label: 'F20',
    value:  30
  }, {
    label: 'F21',
    value:  31
  }, {
    label: 'F22',
    value:  32
  }, {
    label: 'F23',
    value:  33
  }, {
    label: 'F24',
    value:  34
  }, {
    label: '0',
    value: '0'
  }, {
    label: '1',
    value: '1'
  }, {
    label: '2',
    value: '2'
  }, {
    label: '3',
    value: '3'
  }, {
    label: '4',
    value: '4'
  }, {
    label: '5',
    value: '5'
  }, {
    label: '6',
    value: '6'
  }, {
    label: '7',
    value: '7'
  }, {
    label: '8',
    value: '8'
  }, {
    label: '9',
    value: '9'
  }, {
    label: 'A',
    value:  'A'
  }, {
    label: 'B',
    value:  'B'
  }, {
    label: 'C',
    value: 'C'
  }, {
    label: 'D',
    value: 'D'
  }, {
    label: 'E',
    value: 'E'
  }, {
    label: 'F',
    value: 'F'
  }, {
    label: 'G',
    value: 'G'
  }, {
    label: 'H',
    value: 'H'
  }, {
    label: 'I',
    value: 'I'
  }, {
    label: 'J',
    value: 'J'
  }, {
    label: 'K',
    value: 'K'
  }, {
    label: 'L',
    value: 'L'
  }, {
    label: 'M',
    value: 'M'
  }, {
    label: 'N',
    value: 'N'
  }, {
    label: 'O',
    value: 'O'
  }, {
    label: 'P',
    value: 'P'
  }, {
    label: 'Q',
    value: 'Q'
  }, {
    label: 'R',
    value: 'R'
  }, {
    label: 'S',
    value: 'S'
  }, {
    label: 'T',
    value: 'T'
  }, {
    label: 'U',
    value: 'U'
  }, {
    label: 'V',
    value: 'V'
  }, {
    label: 'W',
    value: 'W'
  }, {
    label: 'X',
    value: 'X'
  }, {
    label: 'Y',
    value: 'Y'
  }, {
    label: 'Z',
    value: 'Z'
  }, {
    label: 'Grave',
    value:  71
  }, {
    label: 'Minus',
    value:  72
  }, {
    label: 'Equal',
    value:  73
  }, {
    label: 'Backspace',
    value:  74
  }, {
    label: 'LeftBracket',
    value:  75
  }, {
    label: 'RightBracket',
    value:  76
  }, {
    label: 'Backslash',
    value:  77
  }, {
    label: 'Semicolon',
    value:  78
  }, {
    label: 'Quote',
    value:  79
  }, {
    label: 'Return',
    value:  'RETURN'
  }, {
    label: 'Comma',
    value: 'COMMA'
  }, {
    label: 'Period',
    value: 'PERIOD'
  }, {
    label: 'Slash',
    value: 'SLASH'
  }, {
    label: 'Left',
    value: 'LEFT'
  }, {
    label: 'Up',
    value: 'UP'
  }, {
    label: 'Right',
    value: 'RIGHT'
  }, {
    label: 'Down',
    value: 'DOWN'
  }, {
    label: 'Print',
    value: 'PRINT'
  }, {
    label: 'Pause',
    value: 'PAUSE'
  }, {
    label: 'Insert',
    value: 'INSERT'
  }, {
    label: 'Delete',
    value: 'DELETE'
  }, {
    label: 'Home',
    value: 'HOME'
  }, {
    label: 'End',
    value: 'END'
  }, {
    label: 'PageUp',
    value: 'PAGEUP'
  }, {
    label: 'PageDown',
    value: 'PAGEDOWN'
  }, {
    label: 'Add',
    value: 'ADD'
  }, {
    label: 'Subtract',
    value:  'SUBTRACT'
  }, {
    label: 'Multiply',
    value:  'MULTIPLY'
  }, {
    label: 'Divide',
    value:  'DIVIDE'
  }, {
    label: 'Decimal',
    value:  'DECIMAL'
  }, {
    label: 'Enter',
    value:  'ENTER'
  }, {
    label: 'NumPad0',
    value: 'NUMPAD0'
  }, {
    label: 'NumPad1',
    value: 'NUMPAD1'
  }, {
    label: 'NumPad2',
    value: 'NUMPAD2'
  }, {
    label: 'NumPad3',
    value: 'NUMPAD3'
  }, {
    label: 'NumPad4',
    value: 'NUMPAD4'
  }, {
    label: 'NumPad5',
    value: 'NUMPAD5'
  }, {
    label: 'NumPad6',
    value: 'NUMPAD6'
  }, {
    label: 'NumPad7',
    value: 'NUMPAD7'
  }, {
    label: 'NumPad8',
    value: 'NUMPAD8'
  }, {
    label: 'NumPad9',
    value: 'NUMPAD9'
  }, {
    label: 'CapsLock',
    value:  'CAPSLOCK'
  }, {
    label: 'ScrollLock',
    value: 'SCROLLLOCK'
  }, {
    label: 'NumLock',
    value: 'NUMLOCK'
  }, {
    label: 'AudioMute',
    value: 'AUDIOMUTE'
  }, {
    label: 'AudioVolDown',
    value: 'AUDIOVOLDOWN'
  }, {
    label: 'AudioVolUp',
    value: 'AUDIOVOLUP'
  }, {
    label: 'AudioPlay',
    value: 'AUDIOPLAY'
  }, {
    label: 'AudioStop',
    value: 'AUDIOSTOP'
  }, {
    label: 'AudioPause',
    value: 'AUDIOPAUSE'
  }, {
    label: 'AudioPrev',
    value: 'AUDIOPREV'
  }, {
    label: 'AudioNext',
    value: 'AUDIONEXT'
  }, {
    label: 'AudioRewind',
    value: 'AUDIOREWIND'
  }, {
    label: 'AudioForward',
    value: 'AUDIOFORWARD'
  }, {
    label: 'AudioRepeat',
    value: 'AUDIOREPEAT'
  }, {
    label: 'AudioRandom',
    value: 'AUDIORANDOM'
  }, {
    label: 'LeftWin',
    value:  'LWIN'
  }, {
    label: 'RightWin',
    value:  'RWIN'
  }, {
    label: 'Menu',
    value:  'MENU'
  }, {
    label: 'Fn',
    value:  'FN'
  }];

  constructor(private appRef: ApplicationRef,
              private dialogService: NbDialogService) {
    // exePath is "" in EditorWindow
    window.system.onKeyDown((exePath, ctrl = false, alt = false, shift= false, key) => {
      if (!this.dialogOpened) { return; }
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
