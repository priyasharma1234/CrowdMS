import { inject, Injectable, Injector, signal } from '@angular/core';
import { IUser } from '../types/global';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from '../core/services/session-storage.service';
import { ApiRequestService } from './api-request.service';
import { NgxToasterService } from '../core/services/toasterNgs.service';
import { apiRoutes } from '../config/api-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthCoreService {
    encrypted = signal<boolean | undefined>(undefined);
  readonly user = signal<IUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly token = signal<string | null>(null);
  // encrypted: boolean | undefined = undefined;

  private route = inject(Router);
  private toaster = inject(NgxToasterService);
  private session = inject(SessionStorageService);
  private injector = inject(Injector); // ✅ lazy injector
  private modalService = inject(NgbModal);

  SetUser(_user: IUser | null, _token: string): void {
    console.log("user11111", _user);
    console.log("_token", _token)
    if (_user) {
      this.session.setItem('user', _user);
    } else {
      this.session.removeItem('user');
    }

    if (_token) {
      this.session.setItem('authToken', _token);
    } else {
      this.session.removeItem('authToken');
    }

    this.user.set(_user);
    this.isAuthenticated.set(!!_user);
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
      sessionStorage.clear();
      localStorage.clear();
      this.user.set(null);
      this.isAuthenticated.set(false);
      this.token.set(null);
      this.modalService.dismissAll();
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
      this.toaster.showError(errorMsg ?? 'Session Expired!!', 'Error');
      this.route.navigate(['/auth/login']);
    }
  }

}
