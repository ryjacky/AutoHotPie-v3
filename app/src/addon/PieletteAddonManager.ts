import {PluginManager} from "live-plugin-manager";
import {PieletteSettings} from "../settings/PieletteSettings";
import {PieSingleTaskContext} from "../pieTask/PieSingleTaskContext";
import {Log, PieItemTaskAddon, PieletteAddon} from "pielette-core";
import {clearInterval} from "timers";

function isPieTaskAddon(object: any): object is PieletteAddon {
  return 'onExecuted' in object && 'name' in object;
}

export class PieletteAddonManager {
  // TODO: Make this configurable at user end: {npmInstallMode: "noCache"}
  private static readonly pluginManager = new PluginManager({
    lockWait: 10000,
    npmInstallMode: "useCache"
  });

  private static readonly pieTaskAddons: Map<string, PieItemTaskAddon> = new Map<string, PieItemTaskAddon>();
  private static nextPieTasks: PieSingleTaskContext[] = [];

  private static inExecution: boolean = false;

  static get isExecuting(): boolean { return this.inExecution; }

  static get pieTaskAddonList(): PieletteAddon[] {
    return Array.from(this.pieTaskAddons.values());
  }

  static setPieTasks(contexts: PieSingleTaskContext[]){
    this.nextPieTasks = contexts;
  }

  static async runAllPieTasks(){
    this.inExecution = true;
    while (true){
      const context = this.nextPieTasks.shift();
      if (!context){ break; }

      Log.main.debug(`Running pie tasks, task queue length: ${this.nextPieTasks.length}`);
      await this.runPieTasks(context);
    }
    this.inExecution = false;
  }

  static async runPieTasks(context: PieSingleTaskContext) {
    return await new Promise<boolean>(resolve => {
      const pieTask = PieletteAddonManager.pieTaskAddons.get(context.addonId);
      if (pieTask) {
        let i = 0;

        // Repeat and delay are possibly undefined when updating from old version
        context.repeat ??= 1;
        context.delay ??= 1000;

        const executor = setInterval(() => {
          if (i >= context.repeat) {
            clearInterval(executor);
            resolve(true);
            return;
          }

          Log.main.debug(`i: ${i}, repeat: ${context.repeat}, delay: ${context.delay}`);

          // Set arguments
          Object.assign(pieTask, context);
          Log.main.debug(`Executing pie task ${pieTask.name} with arguments: ${JSON.stringify(pieTask)}`);
          pieTask.onExecuted();
          i++;
        }, context.delay);
      }
    });
  }

  static async loadAddons(): Promise<void> {
    const pluginIds = PieletteSettings.get('plugins');
    Log.main.info("Loading plugins: " + pluginIds.join(', '));

    const failedIds: string[] = [];

    for (const pluginId of pluginIds) {

      try {
        await this.pluginManager.installFromNpm(pluginId)
        const plugin = this.pluginManager.require(pluginId);

        const main = new plugin.Main();
        if (isPieTaskAddon(main)){
          const pieTaskAddon = main as PieItemTaskAddon;
          pieTaskAddon.id = pluginId;
          this.pieTaskAddons.set(pluginId, pieTaskAddon);
        }

      } catch (e) {
        Log.main.error("Error loading addon: " + pluginId)
        console.log(e)
        failedIds.push(pluginId);
      }
    }

    if (failedIds.length > 0) {
      Log.main.warn("Failed to load plugins: " + failedIds.join(', '));
    }

  }

}
