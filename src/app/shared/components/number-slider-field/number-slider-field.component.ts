import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-number-slider-field',
  templateUrl: './number-slider-field.component.html',
  styleUrls: ['./number-slider-field.component.scss']
})
export class NumberSliderFieldComponent implements OnInit {
  @Input() min = -255;
  @Input() max = 255;
  @Input() value = 0;
  @Input() icon = '';
  @Input() fieldSize: 'small' | 'medium' | 'large' = 'small';

  @Output() valueChange = new EventEmitter<number>();

  @ViewChild('inputField') inputField: any;

  prevValue = this.value;
  isPointerDown = false;
  pointerStartX = 0;

  ngOnInit() {
    // FIXME: pointermove and pointerup events are not fired
    //  when the pointer is moved outside the number slider field, if
    //  the user uses a pen-tablet (known issue on xp pen)
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  onPointerDown(e: PointerEvent) {
    this.isPointerDown = true;
    this.prevValue = this.value;
    this.pointerStartX = e.clientX;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isPointerDown) {
      return;
    }

    const delta = (e.clientX - this.pointerStartX);
    this.value = Math.max(this.min, Math.min(this.max, this.prevValue + delta));
    this.valueChange.emit(this.value);
  }

  onPointerUp() {
    this.isPointerDown = false;
  }

  onChange(e: Event) {
    this.value = Math.max(this.min, Math.min(this.max, Number((e.target as HTMLInputElement).value)));
    this.inputField.nativeElement.value = this.value;
    this.valueChange.emit(this.value);
  }
}
