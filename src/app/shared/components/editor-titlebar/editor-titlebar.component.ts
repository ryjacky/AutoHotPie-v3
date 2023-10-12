import {Component, Input, OnInit} from '@angular/core';
import {DBService} from '../../../core/services/db/db.service';

@Component({
  selector: 'app-editor-titlebar',
  templateUrl: './editor-titlebar.component.html',
  styleUrls: ['./editor-titlebar.component.scss']
})
export class EditorTitlebarComponent implements OnInit {
  @Input() pieMenuId = 0;

  pieMenuName = '';

  constructor(
    private dbService: DBService,
  ) {

  }

  ngOnInit() {
    window.log.debug('Retrieving Pie Menu Name of pie menu id: ' + this.pieMenuId);

    this.dbService.pieMenu.get(this.pieMenuId).then(pieMenu => {
      this.pieMenuName = pieMenu?.name ?? '';
      window.log.debug('Retrieved Pie Menu Name: ' + pieMenu?.name);
    });
  }
}
