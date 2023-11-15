import {Injectable} from '@angular/core';
import {Profile} from '../../../../app/src/db/data/Profile';
import {liveQuery} from 'dexie';
import {DBService} from '../../core/services/db/db.service';
import {SelectExeDialogComponent} from './new-profile-dialog/select-exe-dialog.component';
import {IBinaryInfo} from '../../../../app/src/binaryInfo/IBinaryInfo';
import {NbDialogService} from '@nebular/theme';
import {ExecutableAlreadyAddedError} from '../../../../app/src/errors/ExecutableAlreadyAddedError';
import {firstValueFrom} from 'rxjs';
import {DeletingDefaultProfile} from '../../../../app/src/errors/DeletingDefaultProfile';
import {PieMenu} from '../../../../app/src/db/data/PieMenu';
import {ProfilePieMenuData} from '../../../../app/src/db/data/ProfilePieMenuData';

@Injectable()
export class HomeService {

  private _selectedProfile = new Profile();
  private _profiles: Profile[] = [];
  private _selectedProfilePieMenuIds: number[] = [];

  constructor(
    private dbService: DBService,
    private dialogService: NbDialogService,
  ) {
    liveQuery(() => this.dbService.profile.toArray())
      .subscribe((profiles) => this._profiles = profiles);
    this.setSelectedProfile(1);
  }

  get selectedProfilePieMenuIds(): number[] {
    return this._selectedProfilePieMenuIds;
  }

  get selectedProfile(): Profile {
    return this._selectedProfile;
  }

  get profiles(): ReadonlyArray<Profile> {
    return this._profiles;
  }

  async setSelectedProfile(value: number) {
    this._selectedProfile = await this.dbService.profile.get(value) ?? new Profile();
    const profilePieMenuData = await this.dbService.profilePieMenuData.where('profileId').equals(value).toArray();
    this._selectedProfilePieMenuIds = profilePieMenuData.map((data) => data.pieMenuId);
  }

  createProfile(appInfo: IBinaryInfo){
    this.dbService.profile.add(new Profile(appInfo.name, [appInfo.path], appInfo.iconBase64));
  }

  async openDialogSelectExe() {
    return firstValueFrom(this.dialogService.open(SelectExeDialogComponent).onClose)
      .then((result?: IBinaryInfo) => {
        if (result === undefined) { return undefined; }

        // Check and cancel if the profile already exists
        for (const prof of this.profiles) {
          if (prof.exes.includes(result.path)) { throw new ExecutableAlreadyAddedError(); }
        }

        return result;
      });
  }

  addExeToCurrentProfile(selected: IBinaryInfo) {
    this.selectedProfile.exes.push(selected.path);
    this.dbService.profile.update(
      this.selectedProfile.id ?? -1,
      {exes: this.selectedProfile.exes}
    );
  }

  removeExeFromCurrentProfile(exePath: string) {
    this.dbService.profile.update(
      this.selectedProfile.id ?? -1,
      {exes: this._profiles[this.selectedProfile.id ?? -1].exes.filter((path) => path !== exePath)}
    );
  }

  setCurrentProfileEnabled(enabled: boolean) {
    this.dbService.profile.update(this.selectedProfile.id ?? -1, {enabled});
  }

  deleteCurrentProfile(){
    if ((this.selectedProfile.id ?? -1) === 1) { throw new DeletingDefaultProfile(); }
    this.dbService.profile.delete(this.selectedProfile.id ?? -1);
  }

  async createPieMenuInCurrentProfile() {
    // create pie menu
    const newPieMenuId = await this.dbService.pieMenu.add(new PieMenu());
    this.dbService.profilePieMenuData.add(new ProfilePieMenuData(this.selectedProfile.id ?? -1, newPieMenuId as number));
    this.setSelectedProfile(this.selectedProfile.id ?? -1);
  }

  setProfileName(id: number, value: string) {
    if (id === this.selectedProfile.id) {
      this._selectedProfile.name = value;
    }
    this.dbService.profile.update(id, {name: value});
  }
}
