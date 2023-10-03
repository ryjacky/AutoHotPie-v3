import {ActionPlugin, Log, PluginProperties, PluginType} from "pielette-core";
import {PluginManager} from "live-plugin-manager";
import {PieletteSettings} from "../data/settings/PieletteSettings";
import {ActionDelegate} from "../data/actions/ActionDelegate";

export class AHPAddonManager {
  private static readonly pluginManager = new PluginManager();

  private static readonly action: {plugin: ActionPlugin, properties: PluginProperties}[] = [];
  private static readonly actionMap: Map<string, ActionPlugin> = new Map<string, ActionPlugin>();

  public static getActionPlugins(): ReadonlyArray<{plugin: ActionPlugin, properties: PluginProperties}> {
    return this.action;
  }

  public static runAction(actionDelegate: ActionDelegate) {
    AHPAddonManager.actionMap.get(actionDelegate.pluginId)?.onExecuted(actionDelegate.parameters);
  }

  static async loadPlugins(): Promise<void> {
    const pluginIds = PieletteSettings.get('plugins');
    Log.main.info("Loading plugins: " + pluginIds.join(', '));

    const failedIds: string[] = [];

    for (const pluginId of pluginIds) {

      try {
        await this.pluginManager.install(pluginId)
        const plugin = this.pluginManager.require(pluginId);

        const properties = (new plugin.Properties()) as PluginProperties;
        properties.id = pluginId;

        switch (properties.type) {
          case PluginType.ACTION_PLUGIN:
            const actionAddon = new plugin.Main() as ActionPlugin;
            this.action.push({plugin: actionAddon, properties: properties});
            this.actionMap.set(pluginId, actionAddon);
            break;
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
