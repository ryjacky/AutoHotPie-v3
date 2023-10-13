import {Component, Input, ViewChild} from '@angular/core';
import {Profile} from '../../../../../app/src/db/data/Profile';
import {ProfileService} from '../../../core/services/profile/profile.service';

@Component({
  selector: 'app-profile-list-item',
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss']
})

export class ProfileListItemComponent {
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
