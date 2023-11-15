import { PieletteAddon } from "pielette-core";

export class AddonMeta {
  readonly id: string = '';
  readonly name: string = '';

  readonly paramCount: number = 0;

  readonly paramNameList: ReadonlyArray<string> = [];
  readonly paramTypeList: ReadonlyArray<string> = [];

  constructor(public readonly pieletteAddon: PieletteAddon) {
    this.id = pieletteAddon.id;
    this.name = pieletteAddon.name;

    const tempParamNameList: string[] = [];
    const tempParamTypeList: string[] = [];

    for (const paramName of Object.keys(pieletteAddon)) {
      if (paramName.startsWith('param_')) {
        const paramObj = pieletteAddon[paramName];

        // Get the type name of the param object to the typescript type name
        let typeName: string = typeof paramObj;
        // If the type is a PieletteObject, use the typeName property
        typeName = paramObj.typeName ?? typeName;

        // Remove the 'param_' prefix because this name is also displayed in the UI
        tempParamNameList.push(paramName);
        tempParamTypeList.push(typeName);

        this.paramCount++;
      }
    }

    this.paramNameList = tempParamNameList;
    this.paramTypeList = tempParamTypeList;
  }

  getParamName(index: number): any {
    return this.paramNameList[index];
  }

  getParamType(index: number): any {
    return this.paramTypeList[index];
  }

}
