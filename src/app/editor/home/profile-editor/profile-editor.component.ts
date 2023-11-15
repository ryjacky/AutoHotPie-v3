import {Component, EventEmitter, Output, TemplateRef} from '@angular/core';
import {NbDialogService, NbPosition} from '@nebular/theme';
import {ProfileService} from '../../../core/services/profile/profile.service';
import {DBService} from '../../../core/services/db/db.service';
import {SelectExeDialogComponent} from '../new-profile-dialog/select-exe-dialog.component';
import {IBinaryInfo} from '../../../../../app/src/binaryInfo/IBinaryInfo';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent {
  @Output() deleteProfileClicked = new EventEmitter<void>();

  profSettingsRevealed = false;

  color: any;

  protected readonly nbPosition = NbPosition;

  constructor(
    private toastr: ToastrService,
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
    this.dialogService.open(SelectExeDialogComponent)
      .onClose
      .subscribe(async (result?: IBinaryInfo) => {
        if (result !== undefined) {
          // Check and cancel if the profile already exists
          const hasExe = (await this.dbService.profile.where('exes').equals(result.path).count()) !== 0;
          if (!hasExe) {
            this.profileService.addExe(result.path);
          } else {
            this.toastr.error(
              'The selected exe has already existed in your other profiles.',
              'Error creating new profile!',
              {timeOut: 3000, positionClass: 'toast-bottom-right'});
            return;
          }
        }
      });

  }

  removeExecutableVersion($event: string) {
    this.profileService.removeExe($event);
  }
}

