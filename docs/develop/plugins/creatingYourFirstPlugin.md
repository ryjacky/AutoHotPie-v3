# Creating your first plugin
This page describes how to create your first plugin for AutoHotPie.

## Prerequisites
- Node.js ([v20.1.0](https://nodejs.org/dist/v20.1.0/) or later; v20.1.0 is currently used for development)
- [Git](https://git-scm.com/downloads) (any version should work)

### Clone the template repository
Clone the [AutoHotPie plugin template repository](
https://github.com/ryjacky/autohotpie-plugin-template) to your local machine. Or you could directly click "Use this template" button on the repository page to create a new repository based on the template.

For detailed instructions regarding how to clone a repository, you could check the [GitHub documentation](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

### Changing the plugin information
Head into the `package.json` file and change the following fields:
- `name`: The name of the plugin. This name will be used to identify the plugin in the editor.
- `description`: The description of the plugin. This description will be shown in the editor.
- `author`: The author of the plugin. This author will be shown in the editor.

### Hello World
We will use the openurl npm library to open a URL in the browser. Open a terminal in the root directory of your repository and run the following command:
```npm install openurl```

Open the `src/main.ts` file and change the `onExecuted()` method to the following:
```typescript
onExecuted(): void {
  require("openurl").open("https://github.com/dumbeau/AutoHotPie");
}
```

### Changing the plugin's runtime properties
Open the `src/properties.ts` file and change the following fields:
- `author`: The author of the plugin. This author will be shown in the editor.
- `description`: The description of the plugin. This description will be shown in the editor.
- `name`: The name of the plugin. This name will be used to identify the plugin in the editor's action list.
- `type`: The type of the plugin. There exists only ACTION_PLUGIN type for now.
- `parameters`: The parameters of the plugin. The parameter values will be specified in the editor and passed to the plugin when it is executed.
For this example, we could just leave the parameters empty. i.e. `parameters = []`

### Publishing the plugin
AutoHotPie plugins are published as npm packages. Navigate to the root directory of your repository and run the following command:
```npm publish```.

If you are publishing the plugin for the first time, you will be asked to login to your npm account. You could create a new account [here](https://www.npmjs.com/signup).

### Installing the plugin in the editor
Currently, there doesn't exist a plugin manager in the editor. So you will have to manually install the plugin by going into the config file and adding the plugin to the `plugins` array. The setting is located in %appdata%/AutoHotPie3/config.json.
