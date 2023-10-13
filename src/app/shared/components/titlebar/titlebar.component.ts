import {Component, OnInit} from '@angular/core';
import {NbPosition} from '@nebular/theme';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  activePage = 'home';
  serviceActive = true;
  version = '0.0.0';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected readonly NbPosition = NbPosition;

  ngOnInit() {
    window.electronAPI.globalHotkeyServiceExited(() => {
      window.log.info('Global hotkey service exited as notified by the main process');
      this.serviceActive = false;
    });
    window.electronAPI.getVersion().then((version) => {
      this.version = version;
    });
  }

  toggleService() {
    window.electronAPI.toggleService(this.serviceActive).then((serviceActive) => {
      this.serviceActive = serviceActive;
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
