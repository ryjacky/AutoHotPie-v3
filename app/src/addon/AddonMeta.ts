import { PieletteAddon } from "pielette-core";

export class AddonMeta {
  id: string = '';
  name: string = '';

  paramCount: number = 0;

  paramNameList: string[] = [];
  paramTypeList: string[] = [];

  constructor(public readonly pieletteAddon: PieletteAddon) {
    this.id = pieletteAddon.id;
    this.name = pieletteAddon.name;

    for (const paramName of Object.keys(pieletteAddon)) {
      if (paramName.startsWith('param_')) {
        const paramObj = pieletteAddon[paramName];

        // Get the type name of the param object to the typescript type name
        let typeName: string = typeof paramObj;
        // If the type is a PieletteObject, use the typeName property
        typeName = paramObj.typeName ?? typeName;

        // Remove the 'param_' prefix because this name is also displayed in the UI
        this.paramNameList.push(paramName.replace('param_', ''));
        this.paramTypeList.push(typeName);
        this.paramCount++;
      }
    }
  }

  getParamName(index: number): any {
    return this.paramNameList[index];
  }

  getParamType(index: number): any {
    return this.paramTypeList[index];
  }

}
