import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, BehaviorSubject, EMPTY, throwError, of, merge } from 'rxjs';
import { tap, pluck, catchError, map } from 'rxjs/operators';

import { User } from '../../interfaces/';

import { TokenStorage } from './token.storage';

import { config } from '../../../../app/config/config';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) { }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${config.authApiExternal}auth/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          this.setUser(user);
          this.tokenStorage.saveToken(token);
          this.tokenStorage.saveUser(user)
        }),
        map(x=> x.user)
      ).pipe(
        catchError(err => { this.handleError(err); return of('error', err) })
      );;
  }

  register(
    fullname: string,
    email: string,
    password: string,
    repeatPassword: string
  ): Observable<User> {
    return this.http
      .post<AuthResponse>(`${config.authApiExternal}auth/register`, {
        fullname,
        email,
        password,
        repeatPassword,
      })
      .pipe(
        tap(({ token, user }) => {
          this.setUser(user);
          this.tokenStorage.saveToken(token);
          this.tokenStorage.saveUser(user)
        }),
        map(x=> x.user)
      );
  }

  setUser(user: User | null): void {

    if (this.tokenStorage.getUser() == null) {
      this.tokenStorage.saveUser(user!)
    }
    if (user) {
      console.log('setUser()');
      console.log('user: ' + JSON.stringify(user));
      user.isAdmin = user.roles.includes('admin');
      console.log('is user admin ? : ' + user.isAdmin);
    }

    this.user$.next(user);
  }

  getUser(): Observable<User | null> {
    console.log('getUser()');

    if (this.user$.value != null) {
      return this.user$.asObservable();
    }
    else {
     this.user$.next(this.tokenStorage.getUser());
    }

    return this.user$.asObservable();
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.', {}));
  }

  me(): Observable<User> {
    const token: string | null = this.tokenStorage.getToken();

    if (token === null) {
      return EMPTY;
    }

    let user = this.tokenStorage.getUser()
    if (user != null) {
      return of(user);
    }

    return this.http.get<AuthResponse>(`${config.authApiExternal}auth/me`).pipe(
      tap(({ user }) => this.setUser(user)),
      map(x=> x.user)
    ).pipe(
      catchError(err => { this.handleError(err); return of('error', err) })
    );
  }

  signOut(): void {
    this.tokenStorage.signOut();
    this.setUser(null);
  }

  getAuthorizationHeaders() {
    const token: string | null = this.tokenStorage.getToken() || '';
    return { Authorization: `Bearer ${token}`, 'X-Permissions': "CanRead" };

  }

  checkTheUserOnTheFirstLoad(): Promise<User | undefined> {
    let promise = this.me().toPromise() ?? undefined;
    return promise;
  }
}
