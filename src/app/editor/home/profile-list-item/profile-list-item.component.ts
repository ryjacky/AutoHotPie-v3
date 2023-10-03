import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PieletteDBHelper} from '../../../../../app/src/data/userData/PieletteDB';
import {Profile} from '../../../../../app/src/data/userData/Profile';

@Component({
  selector: 'app-profile-list-item',
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss']
})

export class ProfileListItemComponent {
  @Input() profile: Profile = new Profile('');
  @Input() selectedProfileId = 0;
  @Output() profileSelected = new EventEmitter<number>();
  @Output() profileUpdated = new EventEmitter();

  @ViewChild('profNameInput') profNameInput: any;
  @ViewChild('editButton') editButton: any;

  inputDisabled = true;

  selectProfile() {
    this.profileSelected.emit(this.profile.id);
  }

  startEditing() {
    this.inputDisabled = !this.inputDisabled;
  }

  completeEditing() {
    this.inputDisabled = true;

    PieletteDBHelper.profile.update(this.profile.id ?? 0, {name: this.profNameInput.nativeElement.value}).then(() => {
      this.profile.name = this.profNameInput.nativeElement.value;
      window.log.info('Profile of id ' + this.profile.id + ' updated its name to ' + this.profile.name);
    });
  }

}
