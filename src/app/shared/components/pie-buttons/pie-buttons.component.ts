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

@Component({
  selector: 'app-pie-buttons',
  templateUrl: './pie-buttons.component.html',
  styleUrls: ['./pie-buttons.component.scss']
})
export class PieButtonsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() pieMenuId = 1;
  @Input() editorMode = false;

  @ViewChild('pieCenter') pieCenter: any;
  @ViewChild('pieCenterSector') pieCenterSector: any;
  @ViewChild('pieMenuContainer') pieMenuContainer: any;

  @Output() activePieItemId = new EventEmitter<number | undefined>();

  centerX = document.body.clientWidth / 2;
  centerY = document.body.clientHeight / 2;
  activeBtnIndex = -1;
  centerRotation = 0;

  pieMenuService: PieMenuService;

  constructor(pieMenuService: PieMenuService) {
    this.pieMenuService = pieMenuService;
    this.pieMenuService.load(this.pieMenuId, true);
  }

  ngOnInit() {
    this.updatePieItem().then(() => {
      this.drawCenterSector();
      this.drawCenter();

      this.activeBtnIndex = 0;
      this.activePieItemId.emit(this.pieMenuService.pieItemArray[0]?.id);
    });

    // Reset the pie menu center position when the window is resized
    window.addEventListener('resize', () => {
      this.centerX = this.pieMenuContainer.nativeElement.offsetWidth / 2;
      this.centerY = this.pieMenuContainer.nativeElement.offsetHeight / 2;

      window.log.debug(`Pie menu window resized, updating center position`);
    });

    if (this.editorMode) {
      window.addEventListener('mousemove', () => {
        this.drawCenter();
        this.drawCenterSector();
      });
      window.addEventListener('keyup', () => {
        this.drawCenter();
        this.drawCenterSector();
      });
    }

    window.electronAPI.closePieMenuRequested(() => {
      window.log.debug('Received closePieMenuRequested event');
      this.runPieTasks();
    });
  }

  ngAfterViewInit() {
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
      this.runPieTasks();
    } else {
      this.activeBtnIndex = index;
      this.activePieItemId.emit(this.pieMenuService.pieItemArray[index]?.id);
    }
  }

  runPieTasks() {
    window.electronAPI.runPieTasks(JSON.stringify(this.pieMenuService.pieItemArray[this.activeBtnIndex]?.pieTaskContexts ?? []));
  }

  onPointerMove(event: PointerEvent) {
    if (this.editorMode) {
      return;
    }

    // Note: You NEED basic trigonometry and knowledge of math notations for the following code to make sense
    this.centerRotation = Math.atan2(event.clientY - this.centerY, event.clientX - this.centerX);

    this.activeBtnIndex =
      ((Math.floor((
            // Set 0 degree to the top and offset by half of a sector
            ((Math.PI / 2 + this.centerRotation) + Math.PI / this.pieMenuService.pieItemArray.length)
            // Normalize to [-a, b], abs(a) + b = 1
            / (2 * Math.PI))
          // Scale to [-c, d], abs(c) + d = pieItems.length
          * this.pieMenuService.pieItemArray.length)

        // ---------------------------------------------------------------------------
        // Technically speaking, assume 0 degree is at 3 o'clock,
        // -a and -c represents a rotation of PI radians (180 degrees) clockwise
        // b and d represents a rotation of (1.5PI - PI/pieItems.length) radians clockwise
        // ---------------------------------------------------------------------------

      ) + this.pieMenuService.pieItemArray.length) % this.pieMenuService.pieItemArray.length;     // Map to [0, pieItems.length)
  }

  async updatePieItem() {
    if (!this.editorMode) {
      await this.pieMenuService.load(this.pieMenuId, true);
      this.drawCenter();
      this.drawCenterSector();
    }
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
      -Math.PI / this.pieMenuService.pieItemArray.length,
      Math.PI / this.pieMenuService.pieItemArray.length);
    ctx.lineWidth = this.pieMenuService.centerThickness - 2;
    ctx.strokeStyle = this.pieMenuService.mainColor;
    ctx.stroke();
    ctx.closePath();
  }
}
