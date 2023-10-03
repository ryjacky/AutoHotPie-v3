# AutoHotPie source code directories
This page describes the purpose of the directories in the AutoHotPie source code.

## Renderer code directories (ADD SCREENSHOTS)
| Directory                                      | Description                                                                                                                                              |
|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/src/app/help-and-about/`                     | The detailed help and about page that can be opened from the top navigation bar: `Top navigation bar > About`.                                           |
| `/src/app/home/`                               | The first page that will be shown to the user when they launch the editor.                                                                               |
| `/src/app/home/profile-list-item/`             | The single profile (row) component of the profile list which is shown on the left navigation panel at home page, under the "Profile" title.              |
| `/src/app/home/profile-editor/`                | The right hand side panel.                                                                                                                               |
| `/src/app/home/pie-menu-list`                  | The list of pie menu, which is located in the right hand side panel.                                                                                     |
| `/src/app/pie-menu-editor/`                    | The editor page for user to edit the pie menu visuals. Opened when they click on the Edit (Pen) button in the pie menu list.                             |
| `/src/app/pie-menu-editor/action-card`         | A card component that displays action properties and allows the user to modify it.                                                                       |
| `/src/app/pie-menu-editor/settings-tab`        | The settings tab that displays and allows the user to modify the settings of a pie menu. Used in the work area component.                                |
| `/src/app/pie-menu-editor/state`               | A helper class for storing the state of pie menus that are being edited. This is essential for allowing several pie menus to be edited at the same time. |
| `/src/app/pie-menu-editor/work-area-component` | The right hand side panel of the pie menu editor page. It separates into 2 tabs for the pie menu settings and actions.                                   |
| `/src/app/pie-menu-ui/`                        | The core pie menu UI that will be shown to the user when it is called by the user.                                                                       |
| `/src/app/settings/`                           | The page that displays AutoHotPieV3 app settings and allows the user to modify them.                                                                     |
| `/src/app/shared/components`                   | Stores all the shared components that will be used in multiple other components.                                                                         |
| `/src/app/shared/components/page-not-found`    | 404 not found page.                                                                                                                                      |
| `/src/app/shared/components/shortcut-input`    | A special input component that records keyboard shortcut combinations that is pressed by the user.                                                       |
| `/src/app/welcome-page`                        | A welcome page that is displayed to first time users.                                                                                                    |
| `/src/app/`                                    | The "UI Container" that controls the displayed content and is in charge of page navigation.                                                              |
| `/src/assets/`                                 | Stores the asset files that will be used in the UI.                                                                                                      |
| `/src/themes.scss/`                            | Stores the color theme of AHP.                                                                                                                           |
| `/src/index.html/`                             | The entry point of the UI.                                                                                                                               |

## Main process code directories
| Directory                               | Description                                                                                                               |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `/app/src/actions`                      | Contains deprecated code for ahp actions such as send key, send text, etc.                                                |
| `/app/src/data`                         | Contains data class(es) that is used across the editor code.                                                              |
| `/app/src/data/appWindow`               | Contains data class(es) about window (a desktop application window) info.                                                 |
| `/app/src/data/constants`               | Contains global constants used across the editor code.                                                                    |
| `/app/src/data/userData`                | Contains data class(es) about user data.                                                                                  |
| `/app/src/data/userData/AHPDatabase.ts` | Defines the database structure. This is a bit special because it also defines the db object globally.                     |
| `/app/src/data/settings/AHPSettings.ts` | Defines the settings structure. This is a bit special because it also defines the ahpSettings object globally.            |
| `/app/src/plugin`                       | Contains codes of the plugin system that is used only in the editor.                                                      |
| `/app/src/ipcBridge.ts`                 | Contains codes for the electron ipc api. Specifically, the codes that allow the renderer to communicate with the backend. |
| `/app/main.ts`                          | Entry point of the program, creates window and initializes all variables and libraries needed.                            |

## Other code directories
| Directory | Description                                                                       |
|-----------|-----------------------------------------------------------------------------------|
| `/AHPV2`  | Contains the code for AHP V2, the currently (15-Sep-2023) working version of AHP. |
| `/docs`   | Contains this documentation of AHP.                                               |
