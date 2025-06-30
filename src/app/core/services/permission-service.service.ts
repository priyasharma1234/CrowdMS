import { Injectable } from '@angular/core';
import { IPermissionsServiceElement } from '../common/common-config';
import { SessionStorageService } from './session-storage.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class PermissionServiceService {
  removePermission(permission: string) {
    if (!this.permissions) return;
    this.permissions.forEach((perm: any) => {
      perm.permissions = perm.permissions.filter((p: string) => p !== permission);
    });
    if (this.permissions.some((perm: any) => perm.permissions.length === 0)) {
      this.permissions = this.permissions.filter((perm: any) => perm.permissions.length > 0);
    }
  }

  removeModule(module: string) {
    if (!this.permissions) return;

    this.permissions = this.permissions.filter((perm: any) => perm.module !== module);
  }

  permissions: IPermissionsServiceElement[] | null;
  constructor(private _sessionStorageService: SessionStorageService, private _ApiRequestService: ApiRequestService) { }


  async initPermissions() {
    if (!this._sessionStorageService.getItem('userDetails')) {
      this.permissions = [];
      return []
    }
    const userDetails = JSON.parse(this._sessionStorageService.getItem('userDetails'));

    this.permissions = userDetails?.user?.permissions;
    if (this.permissions && !Array.isArray(this.permissions)) {
      this.permissions = Object.values(this.permissions);
    }
    return this.permissions;
  }

  hasModule(_module: string | undefined) {
    if (!_module) return true;
    if (this.permissions) {
    }
    else {
      return false;
    }
    if (!this.permissions) return false;
    return this.permissions.some((permission: any) => {
      return permission.module === _module;
    });
  }

  hasPermission(permission: string | undefined, module?: string) {
    if (!permission) return true;
    if (!this.permissions) return false;
    if (module) {
      let mod = this.permissions.find((perm: any) => perm.module == module);
      if (mod) {
         return mod.permission.includes(permission); 
      }
      return false;
    }
    if (!this.permissions) return false;
    return this.permissions?.some((perm: any) => {
      return perm.permission?.includes(permission);
    });
  }
}
