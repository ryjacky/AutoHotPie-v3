import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NbDialogService, NbPopoverDirective} from '@nebular/theme';
import {Profile} from '../../../../app/src/db/data/Profile';
import {ProfileService} from '../../core/services/profile/profile.service';
import {DBService} from '../../core/services/db/db.service';
import {SelectExeDialogComponent} from './new-profile-dialog/select-exe-dialog.component';
import {IBinaryInfo} from '../../../../app/src/binaryInfo/IBinaryInfo';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ProfileService]
})
export class HomeComponent implements OnInit, OnChanges {
  @ViewChild('profileListItemComponent') profileListItemComponent: any;
  @ViewChild('profInput') profInput: any;
  @ViewChild('profileEditorComponent') profileEditorComponent: any;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective | any;

  profiles: Profile[] = [];

  constructor(
    private toastr: ToastrService,
    private dialogService: NbDialogService,
    private profileService: ProfileService,
    private dbService: DBService,
  ) {
  }

  ngOnInit(): void {
    // Not using db.profile.toArray() as it doesn't trigger the UI update
    this.dbService.profile.each((prof) => {
      this.profiles.push(prof);
    }).then(() => {
      if (this.profiles[0].id) {
        this.profileService.load(this.profiles[0].id);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    window.log.debug('HomeComponent: ngOnChanges() called');
  }

  openNewProfileDialog() {
    this.dialogService.open(SelectExeDialogComponent)
      .onClose
      .subscribe((result?: IBinaryInfo) => {
        if (result !== undefined) {
          // Check and cancel if the profile already exists
          for (const prof of this.profiles) {
            if (prof.exes.includes(result.path)) {
              this.toastr.error(
                'The selected exe has already existed in your other profiles.',
                'Error creating new profile!',
                {timeOut: 3000, positionClass: 'toast-bottom-right'});
              return;
            }
          }

          const newProf = new Profile(
            result.name,
            [result.path],
            result.iconBase64
          );
          this.dbService.profile.add(newProf).then(() => {
            this.profiles.push(newProf);
            this.toastr.success('', 'Created Profile!', {timeOut: 1000, positionClass: 'toast-bottom-right'});
          });
        }
      });
  }
}
