import { SessionStorageService } from '@core/services/session-storage.service';
import { EMPTY, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailsService } from '@core/services/user-details.service';
// import { AuthService } from '@core/services/auth.service'

@Injectable({
    providedIn: 'root',
})
export class CanActivateRouteGuard implements CanActivate {
    loginSession: any;
    modalReference: NgbModalRef;
    constructor(private sessionStorage: SessionStorageService,
        private router: Router,
        private modalService: NgbModal,
        private userDetailsService: UserDetailsService,
        )
         {
          this.userDetailsService.userLoginDetails.subscribe({
            next: (value: any) => {
              this.loginSession= true;
            }
          });
          }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let session: any = this.sessionStorage.getItem('userDetails');
        // this.loginSession = JSON.parse(session).data?.is_kyc == 1 ? true : false;
        // console.log("new activate ",this.loginSession);

        if (session) {
            return true
        }

        return false;
    }
}
