export interface IProfilePieMenuData {
  id?: number;
  profileId: number;
  pieMenuId: number;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

export class ProfilePieMenuData implements IProfilePieMenuData {
  constructor(
    public profileId: number,
    public pieMenuId: number,
    public ctrl = false,
    public alt = false,
    public shift = false,
    public key = '',
    public id?: number,
  ) {

  }
}
