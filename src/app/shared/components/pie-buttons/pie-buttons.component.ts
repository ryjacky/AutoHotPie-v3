import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PieItem} from '../../../../../app/src/data/userData/PieItem';
import {PieletteDBHelper} from '../../../../../app/src/data/userData/PieletteDB';

@Component({
  selector: 'app-pie-buttons',
  templateUrl: './pie-buttons.component.html',
  styleUrls: ['./pie-buttons.component.scss']
})
export class PieButtonsComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() pieMenuId = 1;
  @Input() ringRadius = 20;
  @Input() ringWidth = 10;
  @Input() outerRadius = 150;
  @Input() editorMode = false;

  @ViewChild('pieCenter') pieCenter: any;
  @ViewChild('pieCenterSector') pieCenterSector: any;
  @ViewChild('pieMenuContainer') pieMenuContainer: any;

  @Output() activePieItemId = new EventEmitter<number | undefined>();

  centerX = document.body.clientWidth / 2;
  centerY = document.body.clientHeight / 2;
  hoveredColor = '#159a95';
  activeBtnIndex = -1;
  buttonHeight = 32;
  centerRotation = 0;
  pieItems: (PieItem | undefined)[] = [];

  ngOnInit() {
    this.updatePieItem().then(() => {
      this.drawCenterSector();
      this.activeBtnIndex = 0;
      this.activePieItemId.emit(this.pieItems[0]?.id);
    });

    window.electronAPI.closePieMenuRequested(() => {
      window.log.debug('Received closePieMenuRequested event');
      this.runActions();
    });
  }

  ngAfterViewInit() {
    this.drawCenter();

    this.centerX = this.pieMenuContainer.nativeElement.offsetWidth / 2;
    this.centerY = this.pieMenuContainer.nativeElement.offsetHeight / 2;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pieMenuId) {
      this.updatePieItem().then(() => this.drawCenterSector());
    }
  }

  onButtonClicked(index: number) {
    if (!this.editorMode) {
      this.runActions();
    } else {
      this.activeBtnIndex = index;
      this.activePieItemId.emit(this.pieItems[index]?.id);
    }
  }

  runActions() {
    window.log.debug(`Calling runActions() with ${JSON.stringify(this.pieItems[this.activeBtnIndex]?.actions)}`);
    window.electronAPI.runActions(JSON.stringify(this.pieItems[this.activeBtnIndex]?.actions ?? []));
  }

  onPointerMove(event: PointerEvent) {
    if (this.editorMode) {
      return;
    }

    // Note: You NEED basic trigonometry and knowledge of math notations for the following code to make sense
    const containerPtrX = event.clientX - this.pieMenuContainer.nativeElement.offsetLeft;
    const containerPtrY = event.clientY - this.pieMenuContainer.nativeElement.offsetTop;
    this.centerRotation = Math.atan2(containerPtrY - this.centerY, containerPtrX - this.centerX);

    this.activeBtnIndex =
      ((Math.floor((
            // Set 0 degree to the top and offset by half of a sector
            ((Math.PI / 2 + this.centerRotation) + Math.PI / this.pieItems.length)
            // Normalize to [-a, b], abs(a) + b = 1
            / (2 * Math.PI))
          // Scale to [-c, d], abs(c) + d = pieItems.length
          * this.pieItems.length)

        // ---------------------------------------------------------------------------
        // Technically speaking, assume 0 degree is at 3 o'clock,
        // -a and -c represents a rotation of PI radians (180 degrees) clockwise
        // b and d represents a rotation of (1.5PI - PI/pieItems.length) radians clockwise
        // ---------------------------------------------------------------------------

      ) + this.pieItems.length) % this.pieItems.length;     // Map to [0, pieItems.length)
  }

  async updatePieItem() {
    const pieMenu = await PieletteDBHelper.pieMenu.get(this.pieMenuId);

    if (pieMenu) {
      this.pieItems = await PieletteDBHelper.pieItem.bulkGet(pieMenu.pieItemIds);
      window.log.debug(`${this.pieItems.length} pie items is loaded for Pie Menu [${pieMenu.name}]`);
    } else {
      window.log.warn(`Pie Menu [${this.pieMenuId}] is not found.`);
    }
  }

  private drawCenter() {
    const ctx = this.pieCenter.nativeElement.getContext('2d');

    const center = this.ringRadius + this.ringWidth / 2;

    ctx.beginPath();
    ctx.arc(center, center, this.ringRadius, 0, 2 * Math.PI);
    ctx.lineWidth = this.ringWidth;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  }

  private drawCenterSector() {
    const ctx = this.pieCenterSector.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.ringRadius * 2 + this.ringWidth, this.ringRadius * 2 + this.ringWidth);

    const center = this.ringRadius + this.ringWidth / 2;

    ctx.beginPath();
    ctx.arc(center, center, this.ringRadius, -Math.PI / this.pieItems.length, Math.PI / this.pieItems.length);
    ctx.lineWidth = this.ringWidth;
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.closePath();
  }
}
