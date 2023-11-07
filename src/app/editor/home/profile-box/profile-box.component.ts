import {Component, Input, ViewChild} from '@angular/core';
import {Profile} from '../../../../../app/src/db/data/Profile';
import {ProfileService} from '../../../core/services/profile/profile.service';

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss']
})

export class ProfileBoxComponent {
  @Input() profile: Profile = new Profile('');

  @ViewChild('profNameInput') profNameInput: any;
  @ViewChild('editButton') editButton: any;

  inputDisabled = true;

  profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  selectProfile() {
    this.profileService.load(this.profile.id ?? 0, true);
  }

  startEditing() {
    this.inputDisabled = !this.inputDisabled;
  }

  completeEditing() {
    this.inputDisabled = true;

    this.profileService.setName(this.profNameInput.nativeElement.value);
  }

}
