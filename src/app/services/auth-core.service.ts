import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../core/services/session-storage.service';
import { NgxToasterService } from '../core/services/toasterNgs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toObservable } from '@angular/core/rxjs-interop';
import { SidebarService } from '../pages/sidebar/sidebar-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthCoreService {
  encrypted = signal<boolean | undefined>(undefined);
  readonly isAuthenticated = signal<boolean>(false);
  readonly token = signal<string | null>(null);
  private route = inject(Router);
  private toaster = inject(NgxToasterService);
  private session = inject(SessionStorageService);
  private modalService = inject(NgbModal);

  SetToken(_token: string): void {
    if (_token) {
      this.session.setItem('authToken', _token);
    } else {
      this.session.removeItem('authToken');
    }
    this.token.set(_token);
  }
  logout(hardLogout: boolean = true, errorMsg?: string): void {
    const clear = () => {
      this.isAuthenticated.set(false);
      this.token.set(null);
      this.modalService.dismissAll();
      try { Swal.close(); } catch { }
      sessionStorage.clear();
      localStorage.clear();
    };
    if (hardLogout) {
      this.toaster.showSuccess("Logout Successfully", "Success");
      this.route.navigate(['/auth/login']);
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
}
