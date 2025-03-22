import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, BehaviorSubject, EMPTY, throwError, of } from 'rxjs';
import { tap, pluck, catchError } from 'rxjs/operators';

import { User } from '../../interfaces/';

import { TokenStorage } from './token.storage';

import {config} from '../../../../app/config/config';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private router: Router, private http: HttpClient, private tokenStorage: TokenStorage) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${config.apiBaseUrl2}auth/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          this.setUser(user);
          this.tokenStorage.saveToken(token);
        }),
        pluck('user')
      );
  }

  register(
    fullname: string,
    email: string,
    password: string,
    repeatPassword: string
  ): Observable<User> {
    return this.http
      .post<AuthResponse>(`${config.apiBaseUrl2}auth/register`, {
        fullname,
        email,
        password,
        repeatPassword,
      })
      .pipe(
        tap(({ token, user }) => {
          this.setUser(user);
          this.tokenStorage.saveToken(token);
        }),
        pluck('user')
      );
  }

  setUser(user: User | null): void {
    

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
    return this.user$.asObservable();
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    //this.router.navigateByUrl('/auth/login');
    return throwError(() => new Error('Something bad happened; please try again later.', {}));
  }

  me(): Observable<User> {
    const token: string | null = this.tokenStorage.getToken();

    if (token === null) {
      return EMPTY;
    }

    return this.http.get<AuthResponse>(`${config.apiBaseUrl2}auth/me`).pipe(
      tap(({ user }) => this.setUser(user)),
      pluck('user')
    ).pipe(
      catchError(err => of('error', err))
    );
  }

  signOut(): void {
    this.tokenStorage.signOut();
    this.setUser(null);
  }

  getAuthorizationHeaders() {
    const token: string | null = this.tokenStorage.getToken() || '';
    return { Authorization: `Bearer ${token}`, 'X-Permissions':"CanRead" };
    
  }

  /**
   * Let's try to get user's information if he was logged in previously,
   * thus we can ensure that the user is able to access the `/` (home) page.
   */
  checkTheUserOnTheFirstLoad(): Promise<User | undefined> {
    let promise = this.me().toPromise()?? undefined;
    return promise;
  }
}
