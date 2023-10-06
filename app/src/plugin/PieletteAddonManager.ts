import {PluginManager} from "live-plugin-manager";
import {PieletteSettings} from "../settings/PieletteSettings";
import {PieSingleTaskContext} from "../actions/PieSingleTaskContext";
import {IAddonHeader, Log, PieTaskAddon} from "pielette-core";
import {AugmentedAddonHeader} from "./AugmentedAddonHeader";

export class PieletteAddonManager {
  // TODO: Make this configurable at user end
  private static readonly pluginManager = new PluginManager({npmInstallMode: "noCache"});

  private static readonly pieTask: Map<string, PieTaskAddon> = new Map<string, PieTaskAddon>();
  private static readonly header: Map<string, IAddonHeader> = new Map<string, IAddonHeader>();

  static runPieTasks(context: PieSingleTaskContext): void {
    // So somehow if you put a breakpoint here, the get result is empty, but it actually contains the object.
    PieletteAddonManager.pieTask.get(context.addonId)?.onExecuted(context.args);
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
          this.pieTask.set(pluginId, pieTaskAddon);
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
