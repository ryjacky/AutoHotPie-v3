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
import {PieMenuService} from '../../../core/services/pieMenu/pie-menu.service';
import {IPieItem, PieItem} from '../../../../../app/src/db/data/PieItem';

// TODO: The whole pie button component is needed to be review, it's a mess, better separated it into
//  app-pie-button and app-pie-button-preview

@Component({
  selector: 'app-pie-buttons',
  templateUrl: './pie-buttons.component.html',
  styleUrls: ['./pie-buttons.component.scss'],
})
export class PieButtonsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() pieMenuId = 1;
  @Input() editorMode = false;
  @Input() centerX = document.body.clientWidth / 2;
  @Input() centerY = document.body.clientHeight / 2;

  @ViewChild('pieCenter') pieCenter: any;
  @ViewChild('pieCenterSector') pieCenterSector: any;
  @ViewChild('pieMenuContainer') pieMenuContainer: any;

  @Output() activePieItemId = new EventEmitter<number | undefined>();

  pieItemArray: (IPieItem | undefined)[] = [];

  activeBtnIndex = 0;
  centerRotation = 0;

  pieMenuService: PieMenuService;

  constructor(pieMenuService: PieMenuService) {
    this.pieMenuService = pieMenuService;

    window.pieMenu.onKeyDown(async (exePath: string, ctrl: boolean, alt: boolean, shift: boolean, key: string) => {
      const conditionMet = await pieMenuService.checkConditions(exePath, ctrl, alt, shift, key);
      if (conditionMet) {
        window.log.debug('Pie menu condition met, ');
        window.pieMenu.ready();
      }
    });
  }

  ngOnInit() {
    // Reset the pie menu center position when the window is resized
    window.addEventListener('resize', () => {
      this.centerX = this.pieMenuContainer.nativeElement.offsetWidth / 2;
      this.centerY = this.pieMenuContainer.nativeElement.offsetHeight / 2;

      window.log.debug(`Pie menu window resized, updating center position`);
    });
  }

  ngAfterViewInit() {
    this.centerX = this.pieMenuContainer.nativeElement.offsetWidth / 2;
    this.centerY = this.pieMenuContainer.nativeElement.offsetHeight / 2;

    if (this.editorMode) {
      // Pie menu only needs to be actively updated when in editor mode
      document.body.addEventListener('mousemove', () => this.updatePieItem());
      document.body.addEventListener('mouseup', () => this.updatePieItem());
      document.body.addEventListener('click', () => this.updatePieItem());
      document.body.addEventListener('pointerup', () => this.updatePieItem());
      document.body.addEventListener('mousedown', () => this.updatePieItem());
      document.body.addEventListener('mouseenter', () => this.updatePieItem());
      document.body.addEventListener('mouseleave', () => this.updatePieItem());
      document.body.addEventListener('mouseout', () => this.updatePieItem());
      document.body.addEventListener('mouseover', () => this.updatePieItem());
      document.body.addEventListener('wheel', () => this.updatePieItem());
      document.body.addEventListener('contextmenu', () => this.updatePieItem());
      document.body.addEventListener('dblclick', () => this.updatePieItem());
      document.body.addEventListener('pointerdown', () => this.updatePieItem());
      document.body.addEventListener('pointermove', () => this.updatePieItem());
      document.body.addEventListener('pointercancel', () => this.updatePieItem());
      document.body.addEventListener('pointerenter', () => this.updatePieItem());
      document.body.addEventListener('pointerleave', () => this.updatePieItem());
      document.body.addEventListener('gotpointercapture', () => this.updatePieItem());
      document.body.addEventListener('lostpointercapture', () => this.updatePieItem());
    }

    this.updatePieItem();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onButtonClicked(index: number) {
    if (!this.editorMode) {
      this.setPieTasks();
    } else {
      this.activeBtnIndex = index;
      this.activePieItemId.emit(this.pieItemArray[index]?.id);
    }
  }

  setPieTasks() {
    window.log.debug(`Request to run pie tasks`);
    window.electronAPI.setPieTasks(JSON.stringify(this.pieItemArray[this.activeBtnIndex]?.pieTaskContexts ?? []));
  }

  onPointerMove(event: PointerEvent) {
    if (this.editorMode) {
      return;
    }

    this.setPieTasks();

    if (
      this.pieMenuService.escapeRadius !== 0 &&
      Math.sqrt(
        Math.pow(event.clientY - this.centerY, 2) + Math.pow(event.clientX - this.centerX, 2)
      ) > this.pieMenuService.escapeRadius
    ){
      this.onPointerLeave();
    }

    // Note: You NEED basic trigonometry and knowledge of math notations for the following code to make sense
    this.centerRotation = Math.atan2(event.clientY - this.centerY, event.clientX - this.centerX);

    this.activeBtnIndex =
      ((Math.floor((
            // Set 0 degree to the top and offset by half of a sector
            ((Math.PI / 2 + this.centerRotation) + Math.PI / this.pieItemArray.length)
            // Normalize to [-a, b], abs(a) + b = 1
            / (2 * Math.PI))
          // Scale to [-c, d], abs(c) + d = pieItems.length
          * this.pieItemArray.length)

        // ---------------------------------------------------------------------------
        // Technically speaking, assume 0 degree is at 3 o'clock,
        // -a and -c represents a rotation of PI radians (180 degrees) clockwise
        // b and d represents a rotation of (1.5PI - PI/pieItems.length) radians clockwise
        // ---------------------------------------------------------------------------

      ) + this.pieItemArray.length) % this.pieItemArray.length;     // Map to [0, pieItems.length)
  }

  async updatePieItem() {

    if (!this.editorMode) {
      window.log.debug(JSON.stringify(this.pieMenuService.pieItems.size));
    }

    this.pieItemArray = Array.from(this.pieMenuService.pieItems.values());
    this.drawCenter();
    this.drawCenterSector();
  }

  drawCenter() {
    const ctx = this.pieCenter.nativeElement.getContext('2d');
    ctx.clearRect(
      0,
      0,
      this.pieMenuService.centerRadius * 2 + this.pieMenuService.centerThickness,
      this.pieMenuService.centerRadius * 2 + this.pieMenuService.centerThickness);

    const center = this.pieMenuService.centerRadius + this.pieMenuService.centerThickness / 2;

    ctx.beginPath();
    ctx.arc(center, center, this.pieMenuService.centerRadius, 0, 2 * Math.PI);
    ctx.lineWidth = this.pieMenuService.centerThickness;
    ctx.strokeStyle = this.pieMenuService.secondaryColor;
    ctx.stroke();
    ctx.closePath();
  }

  drawCenterSector() {
    const ctx = this.pieCenterSector.nativeElement.getContext('2d');
    ctx.clearRect(
      0,
      0,
      this.pieMenuService.centerRadius * 2 + this.pieMenuService.centerThickness,
      this.pieMenuService.centerRadius * 2 + this.pieMenuService.centerThickness);

    const center = this.pieMenuService.centerRadius + this.pieMenuService.centerThickness / 2;

    ctx.beginPath();
    ctx.arc(
      center,
      center,
      this.pieMenuService.centerRadius,
      -Math.PI / this.pieItemArray.length,
      Math.PI / this.pieItemArray.length);
    ctx.lineWidth = this.pieMenuService.centerThickness - 2;
    ctx.strokeStyle = this.pieMenuService.mainColor;
    ctx.stroke();
    ctx.closePath();
  }

  iconExists(pieItem?: PieItem) {
    return pieItem?.iconBase64 !== undefined && pieItem?.iconBase64 !== '';
  }

  getComputedBiasedRotation(index: number) {
    if (index % (this.pieItemArray.length/2) === 0) {
      return 0 + 'deg';
    }
    return +90 - index * 360 / this.pieItemArray.length + 'deg';
  }

  getComputedSelfRotation(index: number) {
    if (index === 0) {
      return 90 + 'deg';
    } else if (index === this.pieItemArray.length/2) {
      return -90 + 'deg';
    }
  }

  onPointerLeave() {
    if (!this.editorMode){
      window.log.debug(`Pointer leaved`);
      this.setPieTasks();
    }
  }
}
