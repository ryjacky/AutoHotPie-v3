import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MouseKeyEvent} from '../../../../../app/src/db/data/PieMenu';
import {MouseKeyEventObject} from '../../../../../app/src/mouseKeyEvent/MouseKeyEventObject';

@Component({
  selector: 'app-shortcut-input',
  templateUrl: './shortcut-input.component.html',
  styleUrls: ['./shortcut-input.component.scss']
})
export class ShortcutInputComponent implements OnChanges {
  @Input() hotkey: MouseKeyEvent = MouseKeyEventObject.create();
  @Input() hotkeyString = '';
  @Input() isSingleKey = false;
  @Output() hotkeyChange = new EventEmitter<MouseKeyEvent>();
  @ViewChild('shortcutInput') shortcutInput: any;

  displayString = '';

  ngOnChanges() {
    if (this.hotkeyString) {
      this.hotkey = MouseKeyEventObject.fromString(this.hotkeyString);
    }
    this.displayString =
      (this.hotkey[5] ? 'Ctrl+' : '') +
      (this.hotkey[4] ? 'Shift+' : '') +
      (this.hotkey[6] ? 'Alt+' : '') +
      (this.hotkey[1].toUpperCase());

    console.log('this.displayString: ' + this.displayString);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isSingleKey && (event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift')) { return; }
    this.hotkey = MouseKeyEventObject.fromKeyboardEvent(event);
    this.hotkeyChange.emit(this.hotkey);

    // Un-focus the element at the very last to make sure
    // hotkey is updated/sent to the parent component before the element is blurred
    this.shortcutInput.nativeElement.blur();
  }
}
