import {Injectable, signal} from '@angular/core';
import {IUser} from '../types/global';

@Injectable({
  providedIn: 'root'
})
export class AuthCoreService {
  constructor() { }

  readonly user = signal<IUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly token = signal<string | null>(null);
  SetUser(_user: IUser | null, _token: string) {
    if (_user) {
      sessionStorage.setItem('user', JSON.stringify(_user));
    } else {
      sessionStorage.removeItem('user');
    }
    if (_token) {
      sessionStorage.setItem('authToken', _token);
    } else {
      sessionStorage.removeItem('authToken');
    }
    this.user.set(_user);
    this.isAuthenticated.set(!!_user);
    this.token.set(_token);
    console.log('User and token set in AuthCoreService:', _user, _token);
  }
}
