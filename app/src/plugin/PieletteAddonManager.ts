import {PluginManager} from "live-plugin-manager";
import {PieletteSettings} from "../settings/PieletteSettings";
import {PieSingleTaskContext} from "../actions/PieSingleTaskContext";
import {IAddonHeader, Log, PieTaskAddon} from "pielette-core";
import {AugmentedAddonHeader} from "./AugmentedAddonHeader";
import {clearInterval} from "timers";

export class PieletteAddonManager {
  // TODO: Make this configurable at user end: {npmInstallMode: "noCache"}
  private static readonly pluginManager = new PluginManager();

  private static readonly pieTasks: Map<string, PieTaskAddon> = new Map<string, PieTaskAddon>();
  private static readonly header: Map<string, IAddonHeader> = new Map<string, IAddonHeader>();

  private static nextPieTasks: PieSingleTaskContext[] = [];

  private static inExecution: boolean = false;

  static get isExecuting(): boolean { return this.inExecution; }

  static setPieTasks(contexts: PieSingleTaskContext[]){
    this.nextPieTasks = contexts;
  }

  static async runAllPieTasks(){
    this.inExecution = true;
    while (true){
      const context = this.nextPieTasks.shift();
      if (!context){ break; }

      await this.runPieTasks(context);
    }
    this.inExecution = false;
  }

  static async runPieTasks(context: PieSingleTaskContext) {
    return await new Promise<boolean>(resolve => {
      // So somehow if you put a breakpoint here, the get result is empty, but it actually contains the object.
      const pieTask = PieletteAddonManager.pieTasks.get(context.addonId);
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

          pieTask.onExecuted(context.args);
          i++;
        }, context.delay);
      }
    });
  }

  static get headerObject(): AugmentedAddonHeader[] {
    return Array.from(this.header.entries()).map(
      ([key, value]) => {
        return {id: key, header: value}
      });
  }

  static async loadPlugins(): Promise<void> {
    const pluginIds = PieletteSettings.get('plugins');
    Log.main.info("Loading plugins: " + pluginIds.join(', '));

    const failedIds: string[] = [];

    for (const pluginId of pluginIds) {

      try {
        await this.pluginManager.installFromNpm(pluginId)
        const plugin = this.pluginManager.require(pluginId);

        const header = (new plugin.Header()) as IAddonHeader;
        this.header.set(pluginId, header);

        const main = new plugin.Main();
        if (main instanceof PieTaskAddon){
          const pieTaskAddon = main as PieTaskAddon;
          this.pieTasks.set(pluginId, pieTaskAddon);
        }

      } catch (e) {
        Log.main.error("Error loading plugin: " + pluginId)
        console.log(e)
        failedIds.push(pluginId);
      }
    }

    if (failedIds.length > 0) {
      Log.main.warn("Failed to load plugins: " + failedIds.join(', '));
    }

  }

}
