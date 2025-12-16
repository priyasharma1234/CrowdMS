import { CanActivateFn } from '@angular/router';
import { AuthCoreService } from '../services/auth-core.service';
import { inject } from '@angular/core';
import { SessionStorageService } from '../core/services/session-storage.service';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from '../core/autoLogout/service/auto-logout.service';


export const authGuard: CanActivateFn = (route, state) => {
  const _SessionStorageService = inject(SessionStorageService);
  const _AuthCoreService = inject(AuthCoreService);
  const _AutoLogoutService = inject(AutoLogoutService);

    const authToken = _SessionStorageService.getItem('authToken');
  // const user = _SessionStorageService.getItem('user');

  const isAuthenticated = !!authToken;

  console.log('AuthGuard: Checking authentication status');

  if (isAuthenticated) {
    console.log('User is authenticated');
    _AuthCoreService.SetToken(authToken);
    _AutoLogoutService.USER_IDLE_TIMER_VALUE_IN_MIN = environment.userInactivityTimer;
    _AutoLogoutService.init();
    return true;
  } else {
    sessionStorage.clear();
    localStorage.clear();
    _AutoLogoutService.uninit();
    window.location.href = '/auth/login';
    return false;
  }
};
