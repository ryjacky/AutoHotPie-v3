import {Component} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {IBinaryInfo} from '../../../../../app/src/binaryInfo/IBinaryInfo';

@Component({
  selector: 'app-new-profile-dialog',
  templateUrl: './new-profile-dialog.component.html',
  styleUrls: ['./new-profile-dialog.component.scss']
})
export class NewProfileDialogComponent {
  exes: IBinaryInfo[] = [];
  searchWord = '';

  constructor(
    protected dialogRef: NbDialogRef<NewProfileDialogComponent>,
  ) {
    window.system.getOpenWindows().then((resultJSON) => {
      window.log.debug('resultJSON: ' + resultJSON);

      this.exes = JSON.parse(resultJSON);
    });
  }

  existsExe(exe: IBinaryInfo) {
    return (
      exe.path.toUpperCase().includes(this.searchWord.toUpperCase())
      || exe.name.toUpperCase().includes(this.searchWord.toUpperCase()));
  }
}
