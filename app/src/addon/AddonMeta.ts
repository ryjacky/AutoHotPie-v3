import {PieletteAddon} from "pielette-core";

export class AddonMeta {
  readonly id: string = '';
  readonly name: string = '';

  readonly paramCount: number = 0;

  readonly paramNameList: ReadonlyArray<string> = [];
  readonly paramTypeList: ReadonlyArray<string> = [];

  constructor(public readonly pieletteAddon: PieletteAddon) {
    this.id = pieletteAddon.id ?? '';
    this.name = pieletteAddon.name;

    const tempParamNameList: string[] = [];
    const tempParamTypeList: string[] = [];

    for (const name in pieletteAddon.params) {
      const param = pieletteAddon.params[name];

      // Get the type name of the param object to the typescript type name
      let typeName: string = typeof param;
      // If the type is a PieletteObject, use the typeName property
      typeName = param.typeName ?? typeName;

      tempParamNameList.push(name);
      tempParamTypeList.push(typeName);

      this.paramCount++;
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
