import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { PermissionServiceService } from 'src/app/core/services/permission-service.service';
import { Side_Bar } from 'src/app/core/common/common-config';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  selectedItem: BehaviorSubject<number> = new BehaviorSubject(0);
  sideBarList: BehaviorSubject<any> = new BehaviorSubject(null);
  private m_selectedItemActive: BehaviorSubject<string> = new BehaviorSubject("");

  get selectedItemActive$() {
    return this.m_selectedItemActive.asObservable();
  }
  get selectedItemActive() {
    return this.m_selectedItemActive.value;
  }
  set selectedItemActive(value: string) {
    this.m_selectedItemActive.next(value);
  }


  // constructor(private _permissionService: PermissionServiceService, private _sessionStorage: SessionStorageService) {
  constructor(private _sessionStorage: SessionStorageService,
    private _permissionService: PermissionServiceService
  ) {

  }


  refreshSidebar() {
    if (!sessionStorage.getItem('user')) return;
    // let sideBar: any = [...Side_Bar];
    // let sideBar: any = structuredClone(Side_Bar);
    let sideBar = structuredClone(Side_Bar);
  
    // for (let i = 0; i < sideBar.length; i++) {
    //   const e = sideBar[i];
    //   if (!this._permissionService.hasModule(e.module)) {
    //     sideBar.splice(i, 1);
    //     i--;
    //     continue;
    //   }
    //   if (e.subMenu && e.subMenu.length > 0) {
    //     for (let j = 0; j < e.subMenu.length; j++) {
    //       const subMenu = e.subMenu[j];
    //       if (Array.isArray(subMenu.permission)) {
    //         let hasPermission = false;
    //         for (let k = 0; k < subMenu.permission.length; k++) {
    //           if (this._permissionService.hasPermission(subMenu.permission[k])) {
    //             hasPermission = true;
    //             break;
    //           }
    //         }
    //         if (!hasPermission) {
    //           e.subMenu.splice(j, 1);
    //           j--;
    //         }
    //       }
    //       else if (!this._permissionService.hasPermission(subMenu.permission)) {
    //         e.subMenu.splice(j, 1);
    //         j--;
    //       }
    //     }
    //   }
    // }
    this.sideBarList.next(sideBar);
  }




}
