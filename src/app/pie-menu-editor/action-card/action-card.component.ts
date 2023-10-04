import {Component, Input, OnInit} from '@angular/core';
import {PieTaskContext} from '../../../../app/src/actions/PieTaskContext';
import {AugmentedAddonHeader} from '../../../../app/src/plugin/AugmentedAddonHeader';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnInit {
  @Input() pieTaskContext: PieTaskContext = new PieTaskContext('ahp-send-key', {});

  augmentedAddonHeaders: AugmentedAddonHeader[] = [];
  selectedPluginPropertyIndex = -1;

  ngOnInit(): void {
    window.electronAPI.getPieTaskAddonHeaders().then((addonHeaderJSONs: string[]) => {
      this.augmentedAddonHeaders = addonHeaderJSONs.map((addonHeaderJSON: string) => JSON.parse(addonHeaderJSON) as AugmentedAddonHeader);

      window.log.info(`List of parameters: ${JSON.stringify(this.augmentedAddonHeaders[0].header.receiveArgs)}`);
    });
  }

  updateArgs(argName: string, event: any) {
    if (event?.target?.value === null) { return; }
    this.pieTaskContext.args[argName] = event.target.value;
  }
}
