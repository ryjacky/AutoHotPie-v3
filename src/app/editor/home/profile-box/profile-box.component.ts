import {Component, Input, ViewChild} from '@angular/core';
import {Profile} from '../../../../../app/src/db/data/Profile';
import {ProfileService} from '../../../core/services/profile/profile.service';
import {HomeService} from "../home.service";

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss']
})

export class ProfileBoxComponent {
  @Input() profile: Profile = new Profile('');
  @Input() selected = false;

  @ViewChild('profNameInput') profNameInput: any;
  @ViewChild('editButton') editButton: any;

  inputDisabled = true;

  constructor(
    protected home: HomeService,
  ) {
  }

  startEditing() {
    this.inputDisabled = !this.inputDisabled;
  }

  completeEditing() {
    this.inputDisabled = true;

    this.home.setProfileName(this.profile.id ?? -1, this.profNameInput.nativeElement.value);
  }

}
