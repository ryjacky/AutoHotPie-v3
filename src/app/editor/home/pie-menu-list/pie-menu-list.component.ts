import {Component} from '@angular/core';
import {ProfileService} from '../../../core/services/profile/profile.service';

@Component({
  selector: 'app-pie-menu-list',
  templateUrl: './pie-menu-list.component.html',
  styleUrls: ['./pie-menu-list.component.scss']
})
export class PieMenuListComponent {
  constructor(
    public profileService: ProfileService
  ) {

  }
}
