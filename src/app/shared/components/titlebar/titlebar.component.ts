import {Component, OnInit} from '@angular/core';
import {NbPosition} from '@nebular/theme';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  activePage = 'home';
  version = '0.0.0';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected readonly NbPosition = NbPosition;

  ngOnInit() {
    window.electronAPI.getVersion().then((version) => {
      this.version = version;
    });
  }

  openInBrowser(emitter: string) {
    switch (emitter) {
      case 'github':
        window.electronAPI.openInBrowser('https://github.com/ryjacky/Pielette');
        break;
      case 'bug':
        window.electronAPI.openInBrowser('https://github.com/ryjacky/Pielette/issues/new');
        break;
    }
  }

}
