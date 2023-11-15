import {Component} from '@angular/core';
import {ProfileService} from '../../core/services/profile/profile.service';
import {ToastrService} from 'ngx-toastr';
import {HomeService} from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ProfileService, HomeService]
})
export class HomeComponent {
  constructor(
    protected home: HomeService,
    private toastr: ToastrService,
  ) {
  }

  async openNewProfileDialog() {
    try {
      const exe = await this.home.openDialogSelectExe();
      if (exe) {
        this.home.createProfile(exe);
      }
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message, 'Error creating new profile!', {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
      }
    }
  }

  async deleteCurrentProfile() {
  }
}
