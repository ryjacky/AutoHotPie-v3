# Usage for plugin developers
This page describes the usage of the AutoHotPie core library for plugin developers.

## How are plugins loaded?
The plugins are loaded and installed when the editor is started. The whole process is managed using the `AHPPluginManager` class.

## How are action plugins triggered?
The action plugins are triggered when the user clicks on a pie menu item. The `onExecuted()` method of the action plugin is called when the user clicks on the pie menu item.
