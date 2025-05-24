import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, BehaviorSubject, EMPTY, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { User } from '../../interfaces/';

import { TokenStorage } from './token.storage';

import { config } from '../../../../app/config/config';
import { AuthResponse, PageRequest, Permission, RoleRequest } from '../../../models/models'
import axios from 'axios';
import { RoleActionMap, RoleActionMapNew } from 'src/app/models/othermodels';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {

  }

  async hasPermission(action: string, pageName: string) {
    try {
      let permission: Permission[] = this.tokenStorage.getUserActionsPermitted()!

      let filtered = permission?.filter(permission => permission.actions.find(a => a === action)
        && permission.pageName == pageName);

      if (filtered?.length > 0) {
        return true;
      }
      return false;
    }
    catch (Exception) {
      return false;
    }
  }

  async getAllUsers() {
    return axios.get(`${config.authApiExternal}auth/users`).then(res => res.data);
  }

  async getAllPages() {
    return axios.get(`${config.authApiExternal}auth/pages`).then(res => res.data);
  }

  async createPage(page: string) {
    var roleObj: PageRequest = { page: page }

    return axios.post(`${config.authApiExternal}auth/pages`, roleObj).then(res => res.data);
  }

  async getAllRoles() {
    return axios.get(`${config.authApiExternal}auth/roles`).then(res => res.data);
  }

  async getAllRoleActionmaps() {
    return axios.get(`${config.authApiExternal}auth/roleactions`).then(res => res.data);
  }

  async createRole(role: string) {
    var roleObj: RoleRequest = { role: role }

    return axios.post(`${config.authApiExternal}auth/roles`, roleObj).then(res => res.data);
  }

  async getUserById(id: string) {
    return axios.get(`${config.authApiExternal}auth/users/${id}`).then(res => res.data);
  }

  async getRoleActionsByRoleAndPage(role: string, page: string) {
    return axios.get(`${config.authApiExternal}auth/roleactions/${role}/${page}`).then(res => res.data);
  }

  async updateUser(id: string, user: User) {
    return axios.put(`${config.authApiExternal}auth/users/${id}`, user).then(res => res.data);
  }

  async updateRoleActionMap(id: string, roleActionMap: RoleActionMap) {
    return axios.put(`${config.authApiExternal}auth/roleactions/${id}`, roleActionMap).then(res => res.data);
  }

  async createRoleActionMap(roleActionMap: RoleActionMapNew) {
    return axios.post(`${config.authApiExternal}auth/roleactions`, roleActionMap).then(res => res.data);
  }

  async deleteUser(id: string) {
    return axios.delete(`${config.authApiExternal}auth/users/${id}`).then(res => res.data);
  }

  async deleteRole(id: string) {
    return axios.delete(`${config.authApiExternal}auth/roles/${id}`).then(res => res.data);
  }

  async login(email: string, password: string): Promise<Observable<User>> {
    let result
    try {
      result = await axios.post(`${config.authApiExternal}auth/getpermissions`, { email, password }).then(res => res.data);
      let permission: Permission[] = result as unknown as Permission[]
      this.tokenStorage.saveUserActionsPermitted(permission);

      return this.http
        .post<AuthResponse>(`${config.authApiExternal}auth/login`, { email, password })
        .pipe(
          tap(({ token, user }) => {
            this.setUser(user);
            this.tokenStorage.saveToken(token);
            this.tokenStorage.saveUser(user)
          }),
          map(x => x.user)
        ).pipe(
          catchError(err => { this.handleError(err); return of('error', err) })
        );
    }
    catch (e: any) {
      if (e.response.status == 401){
        alert("Login failed. Either username or password or both are invalid.")
      }
      alert("No permissions found for the current user")
      let user: User = {
        _id: '',
        createdAt: '',
        email: '',
        fullname: '',
        isAdmin: false,
        picture: '',
        roles: []


      }
      return of(user)
    }
  }

  register(
    fullname: string,
    email: string,
    password: string,
    repeatPassword: string,
    picture: string
  ): Observable<User> {
    return this.http
      .post<AuthResponse>(`${config.authApiExternal}auth/register`, {
        fullname,
        email,
        password,
        repeatPassword,
        picture
      })
      .pipe(
        tap(({ token, user }) => {
          this.setUser(user);
          this.tokenStorage.saveToken(token);
          this.tokenStorage.saveUser(user)
        }),
        map(x => x.user)
      ).pipe(
        catchError(err => { this.handleError(err); return of('error', err) })
      );
  }

  setUser(user: User | null): void {

    if (this.tokenStorage.getUser() == null) {
      this.tokenStorage.saveUser(user!)
    }
    if (user) {
      user.isAdmin = user.roles.includes('admin');
    }

    this.user$.next(user);
  }

  getUser(): Observable<User | null> {

    if (this.user$.value != null) {
      return this.user$.asObservable();
    }
    else {
      this.user$.next(this.tokenStorage.getUser());
      if (this.user$.value != null) {
        
      }
      else {
        if (this.user$.asObservable() != null) {
          return this.user$.asObservable();
        }
        else {
          
          return of(null)
        }
      }
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

    throw error.error
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
      tap(({ user }) => 
        this.setUser(user)),
      map(x => x.user)
    ).pipe(
      catchError(err => { this.handleError(err); return of(err) })
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

  async checkTheUserOnTheFirstLoad(): Promise<User | undefined> {
    let promise = await this.me().toPromise() ?? undefined;
    return promise;
  }
}
