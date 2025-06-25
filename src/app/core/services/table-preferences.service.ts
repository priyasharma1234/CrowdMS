import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
type ITablePreferences = {
  CB_authPayouts?: 'TAB' | 'LIST';
  CB_nonAuthPayouts?: 'TAB' | 'LIST';
  PAYIN_transactions?: 'TAB' | 'LIST';
};
@Injectable({
  providedIn: 'root',
})
export class TablePreferencesService {
  public data: ITablePreferences = {};
  constructor(private _SessionStorageService: SessionStorageService) {
    if (
      typeof this._SessionStorageService.getItemLocalStorage('tablePreferences') !== 'undefined' &&
      this._SessionStorageService.getItemLocalStorage('tablePreferences') !== '') {
      let localData =this._SessionStorageService.getItemLocalStorage('tablePreferences');
      this.data = JSON.parse(localData);
    }
  }

  SetTablePreferencesValue(_key: keyof ITablePreferences,_value: 'LIST' | 'TAB') {
    this.data[_key] = _value;
    this._SessionStorageService.setItemLocalStorage('tablePreferences',this.data);
  }

  GetTablePreferencesValue(_key: keyof ITablePreferences) {
    console.log("this.[_key]", _key);
    console.log("this.data[_key]", this.data[_key]);
    return this.data[_key] ?? 'TAB';
  }
}
