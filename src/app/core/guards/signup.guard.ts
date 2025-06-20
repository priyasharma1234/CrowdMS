import { SessionStorageService } from '@core/services/session-storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupGuard implements CanActivate {
  signUpData: any;
  constructor(private sessionStorageService: SessionStorageService,
    private router: Router,
    ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userDetais = this.sessionStorageService.getItem('addUserDetails');
      if(userDetais) this.signUpData = JSON.parse(userDetais).password? true: false;
      if(this.signUpData) return true;
      
      return this.router.navigate(['/login']);
  }
  
}
