import {Component, Input, OnInit} from '@angular/core';
import {PieSingleTaskContext} from '../../../../../app/src/pieTask/PieSingleTaskContext';
import { AddonMeta } from '../../../../../app/src/addon/AddonMeta';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnInit {
  @Input() pieTaskContext: PieSingleTaskContext = new PieSingleTaskContext('ahp-send-key', {});

  allPieTaskAddonParams: AddonMeta[] = [];
  selectedPieTaskAddon = -1;

  ngOnInit(): void {
    window.electronAPI.getPieTaskAddons().then((allPieTaskAddonParamsJSON: string) => {

      // pieTaskAddons is of type PieItemTaskAddon[], but we can't import that type here in the frontend.
      const pieTaskAddons = JSON.parse(allPieTaskAddonParamsJSON) as any[];
      for (const addon of pieTaskAddons){
        this.allPieTaskAddonParams.push(new AddonMeta(addon));
      }
    });
  }

  updateArgs(argName: string, event: any) {
    if (event?.target?.value === null) { return; }
    this.pieTaskContext.args[argName] = event.target.value;
  }

}
