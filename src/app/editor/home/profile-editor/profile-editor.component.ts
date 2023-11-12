import {Component, TemplateRef} from '@angular/core';
import {NbDialogService, NbPosition} from '@nebular/theme';
import {ProfileService} from '../../../core/services/profile/profile.service';
import {DBService} from '../../../core/services/db/db.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent {
  profSettingsRevealed = false;

  color: any;

  protected readonly nbPosition = NbPosition;

  constructor(
    private dialogService: NbDialogService,
    private dbService: DBService,
    public profileService: ProfileService) {
  }

  openPieMenuSelector(pieMenuSelectorDialog: TemplateRef<any>) {
    this.dialogService.open(pieMenuSelectorDialog, {
      context: this.dbService.pieMenu.where('id').noneOf(this.profileService.pieMenuIds).toArray(),
    });
  }

  async addMissingExeClicked() {
    // TODO: Should use the exe selector dialog instead of allowing user to add custom exe
    //  because the exe is not going to be detected if it does not appear in the list of exes
    window.log.info('Waiting for user to select exe');
    const path: string = await window.electronAPI.openDialogForResult(
        this.profileService.exes[0], [{
        name: 'Executables',
        extensions: ['exe']
      }]
    );

    if (!path) {
      window.log.info('User cancelled exe selection');
      return;
    }

    window.log.info('User selected exe ' + path);

    this.profileService.addExe(path);
  }

  removeExecutableVersion($event: string) {
    this.profileService.removeExe($event);
  }
}

