import { CanActivateFn } from '@angular/router';
import {AuthCoreService} from '../services/auth-core.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // Implement your authentication logic here
  // For example, check if the user is logged in
  const isAuthenticated = !!sessionStorage.getItem('authToken');

  const _AuthCoreService = inject(AuthCoreService);

  console.log('AuthGuard: Checking authentication status');
  if (isAuthenticated) {
    console.log('User is authenticated');
    _AuthCoreService.SetUser(JSON.parse(sessionStorage.getItem('user') || '{}'), sessionStorage.getItem('authToken') || '');
    return true;
  } else {
    // Redirect to login or show an error
    window.location.href = '/auth/login'; // Example redirect
    return false; // Prevent access
  }
};
