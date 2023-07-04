import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NbPopoverDirective, NbPosition} from '@nebular/theme';
import {ForegroundWindow} from '../../../app/src/nativeAPI/ForegroundWindow';
import {db} from '../../../app/src/userData/AHPDatabase';
import {Profile} from '../../../app/src/userData/Profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {
  @ViewChild('profileListItemComponent') profileListItemComponent: any;
  @ViewChild('profInput') profInput: any;
  @ViewChild('profileEditorComponent') profileEditorComponent: any;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective | any;

  selectingApp = false;

  focusedFgWin: ForegroundWindow | undefined;
  remainingSec = 5;

  selectedProfId = 1;

  profiles: Profile[] = [];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected readonly NbPosition = NbPosition;

  /**
   * This function will possibly return undefined if when profiles is either empty or has not yet loaded.
   */
  get selectedProf(): Profile | undefined {
    return this.profiles.find((prof) => prof.id === this.selectedProfId) ?? this.profiles[0];
  }

  ngOnInit(): void {
    // Not using db.profile.toArray() as it doesn't trigger the UI update
    db.profile.each((prof) => {
      this.profiles.push(prof);
    }).then(() => {
      this.selectedProfId = this.profiles[0].id ?? 0;
    });
  }

  getActiveApp() {
    this.selectingApp = true;

    this.remainingSec = 5;

    const countdown = setInterval(() => {
      if (this.remainingSec > 0) {
        this.remainingSec--;
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);

      this.selectingApp = false;

      window.electronAPI.getForegroundApplication().then((value) => {
        this.focusedFgWin = JSON.parse(value) as ForegroundWindow;

        if (this.focusedFgWin === undefined) {
          console.warn('HomeComponent: Failed to retrieve foreground window details.');
        }

      });
    }, 5000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    window.log.debug('HomeComponent: ngOnChanges() called');
  }

  createProfile() {
    if (this.focusedFgWin === undefined) {
      window.log.info('There is no focused foreground window. Aborting profile creation.');
      return;
    }

    const newProf = new Profile(
      this.profInput.nativeElement.value,
      undefined,
      [this.focusedFgWin.exePath],
      this.focusedFgWin.iconBase64
    );

    db.profile.add(newProf).then(() => {
      this.profiles.push(newProf);
      window.log.info('Profile of id ' + newProf.id + ' created with name ' + newProf.name);
    });
  }

  updateSelectedProfile($event: number) {
    this.selectedProfId = $event;
  }

  reloadProfEditor() {
    window.log.info('Reloading profile editor');
    this.profileEditorComponent.ngOnChanges();
  }

  clearPopover() {
    if (this.profInput !== undefined) {
      return;
    }

    this.focusedFgWin = undefined;
  }

}
