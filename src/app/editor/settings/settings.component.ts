import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],

})
export class SettingsComponent implements OnInit {
  @ViewChild('settingList') settingList: any;

  runOnAppQuit = false;
  runOnStartup = false;
  pieMenuCancelKey = new KeyboardEvent('keydown');

  ngOnInit() {
    window.electronAPI.getSetting('runOnAppQuit').then((value) => {
      this.runOnAppQuit = value;

      window.log.info('Retrieved runOnAppQuit from settings: ' + this.runOnAppQuit);
    });

    window.electronAPI.getSetting('runOnStartup').then((value) => {
      this.runOnStartup = value;

      window.log.info('Retrieved runOnStartup from settings: ' + this.runOnStartup);
    });

    window.electronAPI.getSetting('pieMenuCancelKey').then((value) => {
      window.log.info('Retrieved pieMenuCancelKey from settings: ' + value);

      this.pieMenuCancelKey = new KeyboardEvent('keydown', {key: value});

      window.log.info('The value is: ' + this.pieMenuCancelKey);
    });
  }

  setRunOnStartup($event: boolean) {
    this.runOnStartup = $event;
    window.electronAPI.setSetting('runOnStartup', $event);
  }

  setPieMenuCancelKey($event: KeyboardEvent) {
    this.pieMenuCancelKey = $event;
    window.electronAPI.setSetting('pieMenuCancelKey', $event);
  }
}
