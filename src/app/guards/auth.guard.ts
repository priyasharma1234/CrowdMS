import { CanActivateFn } from '@angular/router';
import { AuthCoreService } from '../services/auth-core.service';
import { inject } from '@angular/core';
import { SessionStorageService } from '../core/services/session-storage.service';


export const authGuard: CanActivateFn = (route, state) => {
  const _SessionStorageService = inject(SessionStorageService);
  const _AuthCoreService = inject(AuthCoreService);

  const authToken = _SessionStorageService.getItem('authToken');
  const user = _SessionStorageService.getItem('user');

  const isAuthenticated = !!authToken;

  console.log('AuthGuard: Checking authentication status');

  if (isAuthenticated) {
    console.log('User is authenticated');
    _AuthCoreService.SetUser(user, authToken);
    return true;
  } else {
    window.location.href = '/auth/login';
    return false;
  }
};
