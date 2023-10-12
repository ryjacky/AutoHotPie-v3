import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MouseKeyEventHelper} from '../../../../../app/src/mouseKeyEvent/MouseKeyEventHelper';

@Component({
  selector: 'app-shortcut-input',
  templateUrl: './shortcut-input.component.html',
  styleUrls: ['./shortcut-input.component.scss']
})
export class ShortcutInputComponent implements OnChanges {
  @Input() hotkeyString = '';
  @Input() isSingleKey = false;
  @Output() hotkeyChange = new EventEmitter<string>();
  @ViewChild('shortcutInput') shortcutInput: any;

  displayString = '';

  ngOnChanges() {
    const hotkey = this.hotkeyString.split(':');
    this.displayString =
      (hotkey[3] === 'true' ? 'Ctrl+' : '') +
      (hotkey[2] === 'true' ? 'Shift+' : '') +
      (hotkey[4] === 'true' ? 'Alt+' : '') +
      ((hotkey[1] ?? '').toUpperCase());

    console.log('this.displayString: ' + this.displayString);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isSingleKey && (event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift')) { return; }
    this.hotkeyString = MouseKeyEventHelper.KeyboardEventToString(event);
    this.hotkeyChange.emit(this.hotkeyString);

    // Un-focus the element at the very last to make sure
    // hotkey is updated/sent to the parent component before the element is blurred
    this.shortcutInput.nativeElement.blur();
  }
}
