import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-shortcut-input',
  templateUrl: './shortcut-input.component.html',
  styleUrls: ['./shortcut-input.component.scss']
})
export class ShortcutInputComponent implements OnChanges {
  @Input() isSingleKey = false;
  @Input() hotkey = new KeyboardEvent('keydown');
  @Output() hotkeyChange = new EventEmitter<KeyboardEvent>();
  @ViewChild('shortcutInput') shortcutInput: any;

  displayString = '';

  ngOnChanges() {
    this.displayString =
      `${this.hotkey.ctrlKey ? 'Ctrl+' : ''}${this.hotkey.altKey ? 'Alt+' : ''}${this.hotkey.shiftKey ? 'Shift+' : ''}${this.hotkey.key}`;

    console.log('this.displayString: ' + this.displayString);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isSingleKey && (event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift')) { return; }
    this.hotkey = event;
    this.hotkeyChange.emit(event);

    // Un-focus the element at the very last to make sure
    // hotkey is updated/sent to the parent component before the element is blurred
    this.shortcutInput.nativeElement.blur();
  }
}
