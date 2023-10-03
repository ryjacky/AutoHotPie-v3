import {Component, Input, OnInit} from '@angular/core';
import {PluginProperties} from 'pielette-core';
import {ActionDelegate} from '../../../../app/src/data/actions/ActionDelegate';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnInit {
  @Input() actionDelegate: ActionDelegate = new ActionDelegate('ahp-send-key', {});
  pluginPropertyList: PluginProperties[] = [];
  selectedPluginPropertyIndex = -1;

  ngOnInit(): void {
    window.electronAPI.getDetailedActionList().then((pluginPropertyList: string[]) => {
      this.pluginPropertyList = pluginPropertyList.map((pluginProperty: string) => JSON.parse(pluginProperty) as PluginProperties);

      window.log.info(`List of parameters: ${JSON.stringify(this.pluginPropertyList[0].parameters)}`);
    });
  }
}
