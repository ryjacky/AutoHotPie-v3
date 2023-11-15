import {AfterViewChecked, ApplicationRef, Component} from '@angular/core';
import {DBService} from '../core/services/db/db.service';
import {PieMenuService} from '../core/services/pieMenu/pie-menu.service';
import {PieSingleTaskContext} from '../../../app/src/pieTask/PieSingleTaskContext';

@Component({
  selector: 'app-pie-menu-ui',
  templateUrl: './pie-menu-manager.component.html',
  styleUrls: ['./pie-menu-manager.component.scss'],
  providers: [PieMenuService]
})

/**
 * This component is the main component of the pie menu UI.
 * It manages which pie menu to display and the display of a guiding line.
 */
export class PieMenuManagerComponent implements AfterViewChecked {
  pieMenuId = -1;

  toClose = false;
  hidePieMenu = true;

  pieTaskContexts: PieSingleTaskContext[] = [];

  currentHotkey = {shift: false, ctrl: false, alt: false, key: 'a'};

  constructor(
    private dbService: DBService,
    private appRef: ApplicationRef,
    private pieMenuService: PieMenuService
  ) {
    // Subscribe to keydown events and search for a matching pie menu
    window.system.onKeyDown(async (exePath: string, ctrl: boolean, alt: boolean, shift: boolean, key: string) => {
      if (this.currentHotkey.key === key
        && this.currentHotkey.ctrl === ctrl
        && this.currentHotkey.alt === alt
        && this.currentHotkey.shift === shift) {
        return;
      }
      this.currentHotkey = {shift, ctrl, alt, key};

      // Get the pie menu id from the app profile
      // If there is no matching pie menu id, get from the default profile
      this.pieMenuId =
        await this.getMatchingPieMenuId(exePath, ctrl, alt, shift, key)
        ?? await this.getMatchingPieMenuId('', ctrl, alt, shift, key)
        ?? -1;
      if (this.pieMenuId !== -1) {
        try {
          await pieMenuService.forceLoad(this.pieMenuId);

          this.hidePieMenu = false;
          // We need to call tick() to update the view, because this.displayPieMenuId = -1; in the keyup event
          // makes angular not update the view
          appRef.tick();
          window.pieMenu.ready();

          window.log.debug('Pie menu id to display: ' + this.pieMenuId);
        } catch (e) {
          window.log.error(JSON.stringify(e));
        }
      }
    });

    window.system.onKeyUp(() => {
      // Always reset the current hotkey when the key is released
      this.currentHotkey = {shift: false, ctrl: false, alt: false, key: 'a'};

      if (!this.hidePieMenu){
        // We need to hide all pie menus before hiding the pie menu window, because otherwise the previous pie menu
        // might be shown for a short time when the window is shown again
        this.pieMenuId = -1;
        this.hidePieMenu = true;
        this.toClose = true;
        appRef.tick();
      }
    });
  }

  ngAfterViewChecked() {
    if (this.toClose) {
      window.log.debug(`PieTaskContext is ${JSON.stringify(this.pieTaskContexts)}`);

      window.pieMenu.execute(JSON.stringify(this.pieTaskContexts));
      this.pieTaskContexts = [];
      this.toClose = false;
    }
  }

  private async getMatchingPieMenuId(
    exePath: string,
    ctrl = false,
    alt = false,
    shift = false,
    key: string
  ) {
    window.log.debug('Checking pie menu conditions for ' + exePath + ' ' + ctrl + ' ' + alt + ' ' + shift + ' ' + key);

    // Get the profile id for the given exe path or use the default profile id
    let profId = (await this.dbService.profile
      .where('exes')
      .equals(exePath)
      .filter(prof => prof.enabled)
      .first())?.id;
    profId ??= 1;

    window.log.debug('Checking pie menu conditions with profile id ' + profId);

    // Get the first profile pie menu data that matches the given conditions
    const profilePieMenu = await this.dbService.profilePieMenuData
      .where('[profileId+key]')
      .equals([profId ?? -1, key])
      .and(result =>
        result.ctrl === ctrl &&
        result.alt === alt &&
        result.shift === shift
      ).first();

    return profilePieMenu?.pieMenuId;
  }

}
