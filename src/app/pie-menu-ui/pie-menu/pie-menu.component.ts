import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PieMenuService} from '../../core/services/pieMenu/pie-menu.service';
import {PieItem} from '../../../../app/src/db/data/PieItem';
import {PieSingleTaskContext} from '../../../../app/src/pieTask/PieSingleTaskContext';

@Component({
  selector: 'app-pie-menu',
  templateUrl: './pie-menu.component.html',
  styleUrls: ['./pie-menu.component.scss'],
})
export class PieMenuComponent implements AfterViewInit {
  @Output() pieTaskContextsChange = new EventEmitter<PieSingleTaskContext[]>();

  @ViewChild('pieCenter') pieCenter: any;
  @ViewChild('pieCenterSector') pieCenterSector: any;
  @ViewChild('pieMenuContainer') pieMenuContainer: any;

  activeBtnIndex = 0;
  pieSectorRotation = 0;

  constructor(protected pieMenuService: PieMenuService) {}

  ngAfterViewInit() {
    // Draw the center sector, canvas is only available after view init
    this.draw();
  }

  setPieTasks() {
    this.pieTaskContextsChange.emit(Array.from(this.pieMenuService.pieItems.values())[this.activeBtnIndex].pieTaskContexts);
  }

  onPointerMove(event: PointerEvent) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight  / 2;
    // Check if the pointer is outside the escape radius, if so, close the pie menu
    if (
      this.pieMenuService.escapeRadius !== 0 &&
      Math.sqrt(
        Math.pow(event.clientY - centerY, 2) + Math.pow(event.clientX - centerX, 2)
      ) > this.pieMenuService.escapeRadius
    ) {
      this.onPointerLeave();
    }

    // Note: You NEED basic trigonometry and knowledge of math notations for the following code to make sense
    this.pieSectorRotation = Math.atan2(event.clientY - centerY, event.clientX - centerX);

    this.activeBtnIndex =
      ((Math.floor((
            // Set 0 degree to the top and offset by a half of the pie sector
            ((Math.PI / 2 + this.pieSectorRotation) + Math.PI / this.pieMenuService.pieItemIds.length)
            // Normalize to [-a, b], abs(a) + b = 1
            / (2 * Math.PI))
          // Scale to [-c, d], abs(c) + d = pieItems.length
          * this.pieMenuService.pieItemIds.length)

      ) + this.pieMenuService.pieItemIds.length) % this.pieMenuService.pieItemIds.length;     // Map to [0, pieItems.length)

    this.setPieTasks();
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

  getPieItemRotationBias(index: number) {
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
