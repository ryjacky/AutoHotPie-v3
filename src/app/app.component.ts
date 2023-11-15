import {Component, ViewChild} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {APP_CONFIG} from '../environments/environment';
import {Router} from '@angular/router';
import {DBService} from './core/services/db/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('icon') icon: any;
  constructor(
    private router: Router,
    private electronService: ElectronService,
    private translate: TranslateService,
    private dbService: DBService,
  ) {
    this.initAppdata();

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
    if (this.isPieMenuEditor()){
      const urlSplit = this.router.url.split('/');
      return Number(urlSplit[urlSplit.length - 1]);
    }
    return 0;
  }

  async initAppdata() {
    await this.dbService.init();
  }

  isPieMenuEditor() {
    return this.router.url.includes('/pie-menu-editor');
  }

  showHeader() {
    return this.router.url !== '/pieMenuUI' && this.router.url !== '/splash-screen';
  }
}
