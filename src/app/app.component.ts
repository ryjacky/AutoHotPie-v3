import {Component, ViewChild} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {APP_CONFIG} from '../environments/environment';
import {PieletteDBHelper} from '../../app/src/db/PieletteDB';
import {Router} from '@angular/router';
import {PieMenu} from '../../app/src/db/data/PieMenu';
import {Profile} from '../../app/src/db/data/Profile';
import {PieItem} from '../../app/src/db/data/PieItem';

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
    private translate: TranslateService
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
    window.log.info('Initializing/Loading app data');

    if ((await PieletteDBHelper.profile.count()) === 0) {
      window.log.info('No profile found, creating default profile');

      await PieletteDBHelper.pieItem.bulkPut([
        new PieItem('', 'PieItem 1'),
        new PieItem('', 'PieItem 2'),
        new PieItem('', 'PieItem 3'),
        new PieItem('', 'PieItem 4'),
        new PieItem('', 'PieItem 5'),
      ]);

      const defaultPieMenu = new PieMenu();
      defaultPieMenu.name = 'Default Pie Menu';
      defaultPieMenu.id = 1;
      defaultPieMenu.pieItemIds = [1, 2, 3, 4, 5];
      const pieMenuId = await PieletteDBHelper.pieMenu.put(defaultPieMenu);

      await PieletteDBHelper.profile.put(new Profile(
        'Default Profile',
        [pieMenuId as number],
        [],
        undefined,
        true,
        1
      ));

    }

    window.log.info('App data loaded');
  }

  isPieMenuEditor() {
    return this.router.url.includes('/pie-menu-editor');
  }

  showHeader() {
    return this.router.url !== '/pieMenuUI' && this.router.url !== '/splash-screen';
  }
}
