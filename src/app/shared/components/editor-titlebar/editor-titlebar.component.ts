import {Component, Input, OnInit} from '@angular/core';
import {PieletteDBHelper} from '../../../../../app/src/db/PieletteDB';

@Component({
  selector: 'app-editor-titlebar',
  templateUrl: './editor-titlebar.component.html',
  styleUrls: ['./editor-titlebar.component.scss']
})
export class EditorTitlebarComponent implements OnInit {
  @Input() pieMenuId = 0;

  pieMenuName = '';

  ngOnInit() {
    window.log.debug('Retrieving Pie Menu Name of pie menu id: ' + this.pieMenuId);

    PieletteDBHelper.pieMenu.get(this.pieMenuId).then(pieMenu => {
      this.pieMenuName = pieMenu?.name ?? '';
      window.log.debug('Retrieved Pie Menu Name: ' + pieMenu?.name);
    });
  }
}
