import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PieMenuService} from '../../core/services/pieMenu/pie-menu.service';
import {PieItem} from '../../../../app/src/db/data/PieItem';

@Component({
  selector: 'app-pie-menu',
  templateUrl: './pie-menu.component.html',
  styleUrls: ['./pie-menu.component.scss'],
  providers: [PieMenuService]
})
export class PieMenuComponent implements OnInit, AfterViewInit {

  @Input() pieMenuId = 1;

  @ViewChild('pieCenter') pieCenter: any;
  @ViewChild('pieCenterSector') pieCenterSector: any;
  @ViewChild('pieMenuContainer') pieMenuContainer: any;

  centerX = window.innerWidth / 2;
  centerY = window.innerHeight  / 2;

  activeBtnIndex = 0;
  centerRotation = 0;

  constructor(protected pieMenuService: PieMenuService) {}

  ngOnInit() {
    // Reset the pie menu center position when the window is resized
    window.addEventListener('resize', () => {
      this.centerX = window.innerWidth / 2;
      this.centerY = window.innerHeight  / 2;

      window.log.debug(`Pie menu window resized, updating center position`);
    });

    this.pieMenuService.forceLoad(this.pieMenuId);
  }

  ngAfterViewInit() {
    // Draw the center sector, canvas is only available after view init
    this.draw();
  }

  onButtonClicked() {
    this.setPieTasks();
  }

  setPieTasks() {
    window.log.debug(`Request to run pie tasks`);
    // window.electronAPI.setPieTasks(JSON.stringify(this.pieItemArray[this.activeBtnIndex]?.pieTaskContexts ?? []));
  }

  onPointerMove(event: PointerEvent) {
    // Check if the pointer is outside the escape radius, if so, close the pie menu
    if (
      this.pieMenuService.escapeRadius !== 0 &&
      Math.sqrt(
        Math.pow(event.clientY - this.centerY, 2) + Math.pow(event.clientX - this.centerX, 2)
      ) > this.pieMenuService.escapeRadius
    ) {
      this.onPointerLeave();
    }

    // Note: You NEED basic trigonometry and knowledge of math notations for the following code to make sense
    this.centerRotation = Math.atan2(event.clientY - this.centerY, event.clientX - this.centerX);

    this.activeBtnIndex =
      ((Math.floor((
            // Set 0 degree to the top and offset by half of a sector
            ((Math.PI / 2 + this.centerRotation) + Math.PI / this.pieMenuService.pieItemIds.length)
            // Normalize to [-a, b], abs(a) + b = 1
            / (2 * Math.PI))
          // Scale to [-c, d], abs(c) + d = pieItems.length
          * this.pieMenuService.pieItemIds.length)

        // ---------------------------------------------------------------------------
        // Technically speaking, assume 0 degree is at 3 o'clock,
        // -a and -c represents a rotation of PI radians (180 degrees) clockwise
        // b and d represents a rotation of (1.5PI - PI/pieItems.length) radians clockwise
        // ---------------------------------------------------------------------------

      ) + this.pieMenuService.pieItemIds.length) % this.pieMenuService.pieItemIds.length;     // Map to [0, pieItems.length)

    this.draw();
  }

  draw() {
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
      -Math.PI / this.pieMenuService.pieItemIds.length,
      Math.PI / this.pieMenuService.pieItemIds.length);
    ctx.lineWidth = this.pieMenuService.centerThickness - 2;
    ctx.strokeStyle = this.pieMenuService.mainColor;
    ctx.stroke();
    ctx.closePath();
  }

  iconExists(pieItem?: PieItem) {
    return pieItem?.iconBase64 !== undefined && pieItem?.iconBase64 !== '';
  }

  getComputedSelfRotation(index: number) {
    if (index === 0) {
      return 90 + 'deg';
    } else if (index === this.pieMenuService.pieItemIds.length / 2) {
      return -90 + 'deg';
    }
  }

  onPointerLeave() {
    window.log.debug(`Pointer leaved`);
    this.setPieTasks();
  }
}
