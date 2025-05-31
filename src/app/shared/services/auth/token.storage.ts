import { Injectable } from '@angular/core';
import { User } from '../../interfaces';
import { Permission } from 'src/app/models/models';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private tokenKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd9f';
  private userKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd98';
  private googleIdTokenKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd91';
  private userActionsKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd92';

  signOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.userActionsKey);
    localStorage.removeItem(this.googleIdTokenKey);
    localStorage.clear();
  }

  saveToken(token?: string): void {
    if (!token) return;
    localStorage.setItem(this.tokenKey, token);
  }

  saveUserActionsPermitted(actions?: Permission[]): void {
    if (!actions) return;
    localStorage.setItem(this.userActionsKey, JSON.stringify(actions));
  }

  saveGoogleIdToken(token?: string): void {
    if (!token) return;
    localStorage.setItem(this.googleIdTokenKey, token);
  }

  saveUser(user: User): void {
    if (!user) return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? (JSON.parse(userData) as User) : null;
  }

  getToken(): string | null {
    const userData = localStorage.getItem(this.tokenKey);
    return userData
  }

  getUserActionsPermitted(): Permission[] | null {
    const userData = localStorage.getItem(this.userActionsKey);
    return JSON.parse(userData!)
  }

  getGoogleIdToken(): string | null {
    const userData = localStorage.getItem(this.googleIdTokenKey);
    return userData
  }
}
