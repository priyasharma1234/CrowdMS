import { inject, Injectable, Injector, signal } from '@angular/core';
import { IUser } from '../types/global';
import { Router } from '@angular/router';
import { SessionStorageService } from '../core/services/session-storage.service';
import { ApiRequestService } from './api-request.service';
import { NgxToasterService } from '../core/services/toasterNgs.service';
import { apiRoutes } from '../config/api-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toObservable } from '@angular/core/rxjs-interop';
import { SidebarService } from '../pages/sidebar/sidebar-service.service';
import { AutoLogoutService } from '../core/autoLogout/service/auto-logout.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthCoreService {
  encrypted = signal<boolean | undefined>(undefined);
  readonly user = signal<IUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly token = signal<string | null>(null);
  // encrypted: boolean | undefined = undefined;

  readonly userPermission = signal<IUser | null>(null);

  private route = inject(Router);
  private toaster = inject(NgxToasterService);
  private session = inject(SessionStorageService);
  private injector = inject(Injector); // ✅ lazy injector
  private modalService = inject(NgbModal);
  private _SidebarService = inject(SidebarService);
  private _AutoLogoutService = inject(AutoLogoutService);

  SetUser(_token: string): void {
    // console.log("user11111", _user);
    // console.log("_token", _token)
    // if (_user) {
    //   this.session.setItem('user', _user);
    // } else {
    //   this.session.removeItem('user');
    // }

    if (_token) {
      this.session.setItem('authToken', _token);
    } else {
      this.session.removeItem('authToken');
    }

    // this.user.set(_user);
    // this.isAuthenticated.set(!!_user);
    this.token.set(_token);
  }

  setUserLoginDetails(data: any) {
    this.session.setItem('user', JSON.stringify(data));
    localStorage.setItem('user', JSON.stringify(data));
    this._SidebarService.refreshSidebar();
    this.user.set(data);
  }
  SetToken(_token: string) {
    if (_token) {
      sessionStorage.setItem('authToken', _token);
    } else {
      sessionStorage.removeItem('authToken');
    }
    this.token.set(_token);
  }
  logout(hardLogout: boolean = true, errorMsg?: string): void {
    // const clear = () => {
    //   this.session.clearStorage();
    //   this.user.set(null);
    //   this.isAuthenticated.set(false);
    //   this.token.set(null);
    // };
    const clear = () => {
      this.user.set(null);
      this.isAuthenticated.set(false);
      this.token.set(null);
      this.modalService.dismissAll();
      this._AutoLogoutService.logout();
      try { Swal.close(); } catch { }
      sessionStorage.clear();
      localStorage.clear();
    };


    const _ApiRequestService = this.injector.get(ApiRequestService);
    if (hardLogout) {
      const payload = new FormData();
      _ApiRequestService.postData({ payload }, apiRoutes.auth.logout).subscribe({
        next: (resp) => {
          if (resp.statuscode === 200) this.toaster.showSuccess(resp?.message, "Success");
          clear();
          this.route.navigate(['/auth/login']);
        },
        error: () => {
          clear();
          this.route.navigate(['/auth/login']);
        }
      });
    } else {
      clear();
      if (errorMsg) {
        this.toaster.showSuccess(errorMsg, 'Success');
      } else {
        this.toaster.showError('Session Expired!!', 'Error');
      }
      this.route.navigate(['/auth/login']);
    }
  }

  setUserPermission(_permission: any) {
    console.log('setting session', _permission);
    this.session.setItem('userPermissions', JSON.stringify(_permission));
  //  localStorage.setItem('userPermissions', JSON.stringify(_permission));
    this._SidebarService.refreshSidebar();
    this.userPermission.set(_permission);
  }

  // ✅ getter as signal
  get getUserPermission() {
    return this.userPermission.asReadonly(); // readonly signal
  }

  // ✅ also expose as observable if old code still expects observable
  get userPermission$() {
    return toObservable(this.userPermission);
  }

  // delete(clear?: string | string[]) {
  //   const current = this.user();
  //   if (current && clear) {
  //     const result = _.omit(current, clear);
  //     this.user.set(result);
  //   } else {
  //     this.user.set(null);
  //   }
  // }

  // updateLocalStorage(obj: any) {
  //   const encode: any = this.session.getItem('user');
  //   let loginDtl: any = encode ? JSON.parse(encode) : {};

  //   if (Array.isArray(obj)) {
  //     obj.forEach((element) => {
  //       for (const k in element) {
  //         _.set(loginDtl, k, element[k]);
  //       }
  //     });
  //   } else {
  //     for (const k in obj) {
  //       _.set(loginDtl, k, obj[k]);
  //     }
  //   }

  //   this.SetUser(loginDtl);
  // }

}
