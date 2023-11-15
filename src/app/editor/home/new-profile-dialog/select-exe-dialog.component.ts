import {Component} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {IBinaryInfo} from '../../../../../app/src/binaryInfo/IBinaryInfo';

@Component({
  selector: 'app-new-profile-dialog',
  templateUrl: './select-exe-dialog.component.html',
  styleUrls: ['./select-exe-dialog.component.scss']
})
export class SelectExeDialogComponent {
  openedExes: IBinaryInfo[] = [];
  searchWord = '';

  constructor(
    protected dialogRef: NbDialogRef<SelectExeDialogComponent>,
  ) {
    window.system.getOpenWindows().then((resultJSON) => {
      window.log.debug('resultJSON: ' + resultJSON);

      this.openedExes = JSON.parse(resultJSON);
    });
  }

  searchExe(exe: IBinaryInfo) {
    return (
      exe.path.toUpperCase().includes(this.searchWord.toUpperCase())
      || exe.name.toUpperCase().includes(this.searchWord.toUpperCase()));
  }
}
