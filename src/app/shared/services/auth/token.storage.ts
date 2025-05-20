import { Injectable } from '@angular/core';
import { User } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private tokenKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd9f';
  private userKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd98';

  signOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.clear();
  }

  saveToken(token?: string): void {
    if (!token) return;
    localStorage.setItem(this.tokenKey, token);
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
}
