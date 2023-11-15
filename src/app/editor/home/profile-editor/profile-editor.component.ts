import {Component, EventEmitter, Output} from '@angular/core';
import {NbPosition} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {HomeService} from '../home.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent {
  @Output() deleteProfileClicked = new EventEmitter<void>();

  profSettingsRevealed = false;


  protected readonly nbPosition = NbPosition;

  constructor(
    protected home: HomeService,
    private toastr: ToastrService) {
  }

  async addMissingExeClicked() {
    try {
      const exe = await this.home.openDialogSelectExe();
      if (exe) {
        this.home.addExeToCurrentProfile(exe);
      }
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.warning(
          e.message,
          'Cannot create new profile!',
          {timeOut: 3000, positionClass: 'toast-bottom-right'});
      }
    }
  }

}

