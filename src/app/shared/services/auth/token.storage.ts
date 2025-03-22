import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private tokenKey = '0a6b944d-d2fb-46fc-a85e-0295c986cd9f';

  signOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.clear();
  }

  saveToken(token?: string): void {
    if (!token) return;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
