import { SessionStorageService } from '@core/services/session-storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PermissionServiceService } from '@core/services/permission-service.service';
import { Observable } from 'rxjs';
import { SidebarService } from '@features/layouts/components/sidebar/sidebar-service.service';
import {isArray} from "lodash";

@Injectable({
  providedIn: 'root'
})
export class StamentsGuardGuard implements CanActivate {

  modules: any[] = [];
  payoutSideBar: any = null;

  constructor(
    private permission: PermissionServiceService,
     private _SessionStorageService: SessionStorageService,
    private sidebarService: SidebarService,
    private router: Router
  ){

    // this.modules = this.permission.initPermissions()
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // return true;
      let {role} = route.data;
      if(isArray(role)) {
        let hasPerm = false;
        for (const item of role) {
            let permission = this.permission.hasPermission(item);
            if (permission) {
                hasPerm = permission;
                break;
            }
        }
          if (!hasPerm) {
            this.router.navigate(['dashboard']);
            this.sidebarService.selectedItem.next(0);
            this._SessionStorageService.setItem('selectd_item', 'Dashboard');
          }

        return hasPerm;
      }

      let permission = this.permission.hasPermission(role);

      if (!permission){
          this.router.navigate(['dashboard']);
          this.sidebarService.selectedItem.next(0);
          this._SessionStorageService.setItem('selectd_item', 'Dashboard');
        }
      return permission;
  }

}
