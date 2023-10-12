import {Component, ViewChild} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {APP_CONFIG} from '../environments/environment';
import {PieletteDBHelper} from '../../app/src/db/PieletteDB';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('icon') icon: any;

  version = '0.0.0';

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private translate: TranslateService,
  ) {
    this.initAppdata();

    window.electronAPI.getVersion().then((version) => {
      this.version = version;
    });

    this.translate.setDefaultLang('en');

    window.log.info('APP_CONFIG ' + APP_CONFIG);

    if (electronService.isElectron) {
      window.log.info('' + process.env);
      window.log.info('Run in electron');
      window.log.info('Electron ipcRenderer ' + this.electronService.ipcRenderer);
      window.log.info('NodeJS childProcess ' + this.electronService.childProcess);
    } else {
      window.log.info('Run in browser');
    }
  }

  get editingPieMenuId(): number {
    return Number(new URLSearchParams(this.router.url.substring(this.router.url.indexOf('?'))).get('pieMenuId') ?? '0');
  }

  async initAppdata() {
    //TODO: Should be put in welcome guide
    await PieletteDBHelper.init();
  }

  isPieMenuEditor() {
    return this.router.url.includes('/pie-menu-editor');
  }

  showHeader() {
    return this.router.url !== '/pieMenuUI' && this.router.url !== '/splash-screen';
  }
}
