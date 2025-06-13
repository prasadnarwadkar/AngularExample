import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { v4 } from 'uuid';
import { Observable, BehaviorSubject, EMPTY, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { User } from '../../interfaces/';

import { TokenStorage } from './token.storage';

import { AuditLogRequest, AuthResponse, EmailAndDoctorIdRequest, EmailRequest, IdRequest, PasswordRequest, Permission, RoleRequest, SendEmailRequest } from '../../../models/models'
import axios from 'axios';
import { Page, RoleActionMap, RoleActionMapNew } from 'src/app/models/othermodels';
import { environment } from 'src/environment/environment.development';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Create an Axios instance
  apiClient = axios.create({
    headers: {
      'api-key': ''
    },
  });
  private user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private authApiExternal = environment.authApiExternal

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {
    console.log("Auth API Base Url is ", this.authApiExternal)
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
    return this.apiClient.get(`${this.authApiExternal}auth/users`).then(res => res.data);
  }

  async getAllPages() {
    // Update newly added pages here.
    // This is manual action so that no one 
    // accidentally modifies something that will break the app.
    return [
      { page: 'roles' },
      { page: 'users' },
      { page: 'patients' },
      { page: 'admin' },
      { page: 'roleactionmaps' },
      { page: 'auditlogs' },
      { page: 'doctors' },
      { page: 'records' },
      { page: 'bills' }
    ]
  }

  async createPage(page: string) {
    var roleObj: Page = { page: page }

    return this.apiClient.post(`${this.authApiExternal}auth/pages`, roleObj).then(res => res.data);
  }

  async getAllRoles() {
    return this.apiClient.get(`${this.authApiExternal}auth/roles`).then(res => res.data);
  }

  async getAllAuditLogs() {
    return this.apiClient.get(`${this.authApiExternal}auth/auditlogs`).then(res => res.data);
  }

  async getAllRoleActionmaps() {
    return this.apiClient.get(`${this.authApiExternal}auth/roleactions`).then(res => res.data);
  }

  async createRole(role: RoleRequest) {
    var roleObj: RoleRequest = { role: role.role, desc: role.desc }

    return this.apiClient.post(`${this.authApiExternal}auth/roles`, roleObj).then(res => res.data);
  }

  async createAuditLog(auditLog: AuditLogRequest) {

    if (auditLog?.valueChanged?.newvalue != auditLog?.valueChanged?.oldvalue) {
      return this.apiClient.post(`${this.authApiExternal}auth/auditlogs`, auditLog).then(res => res.data);
    }
  }

  async forgotPassword(email: string) {
    var emailObj: EmailRequest = { email: email }

    return this.apiClient.post(`${this.authApiExternal}forgot-password`, emailObj).then(res => res.data);
  }

  async assignDocRoleToUser(emailAndDoctorId: EmailAndDoctorIdRequest) {
    var emailObj: EmailAndDoctorIdRequest = { email: emailAndDoctorId.email, doctor_id: emailAndDoctorId.doctor_id }

    return this.apiClient.post(`${this.authApiExternal}assignDocRoleToUser`, emailObj).then(res => res.data);
  }

  async sendEmail(recipient: string, cc: string, subject: string, text: string) {
    var emailObj: SendEmailRequest = { recipient: recipient, cc: cc, subject: subject, text: text }

    return this.apiClient.post(`${this.authApiExternal}sendEmail`, emailObj).then(res => res.data);
  }

  async getProfilePic(id: string) {
    var obj: IdRequest = { id: id }

    return this.apiClient.post(`${this.authApiExternal}getProfilePic`, obj).then(res => res.data);
  }

  async uploadProfilePic(formData: FormData) {
    return this.apiClient.post(`${this.authApiExternal}uploadProfilePic2`, formData).then(res => res.data);
  }

  async resetPassword(token: string, password: string) {
    var obj: PasswordRequest = { password: password }

    return this.apiClient.post(`${this.authApiExternal}reset-password/${token}`, obj).then(res => res.data);
  }

  async getUserById(id: string) {
    return this.apiClient.get(`${this.authApiExternal}auth/users/${id}`).then(res => res.data);
  }

  async getRoleActionsByRoleAndPage(role: string, page: string) {
    return this.apiClient.get(`${this.authApiExternal}auth/roleactions/${role}/${page}`).then(res => res.data);
  }

  async updateUser(id: string, user: User) {
    return this.apiClient.put(`${this.authApiExternal}auth/users/${id}`, user).then(res => res.data);
  }

  async updateRoleActionMap(id: string, roleActionMap: RoleActionMap) {
    return this.apiClient.put(`${this.authApiExternal}auth/roleactions/${id}`, roleActionMap).then(res => res.data);
  }

  async createRoleActionMap(roleActionMap: RoleActionMapNew) {
    roleActionMap.id = v4()
    return this.apiClient.post(`${this.authApiExternal}auth/roleactions`, roleActionMap).then(res => res.data);
  }

  async deleteUser(id: string) {
    return this.apiClient.delete(`${this.authApiExternal}auth/users/${id}`).then(res => res.data);
  }



  async disableUser(id: string) {
    return this.apiClient.delete(`${this.authApiExternal}auth/users/disable/${id}`).then(res => res.data);
  }

  async enableUser(id: string) {
    return this.apiClient.delete(`${this.authApiExternal}auth/users/enable/${id}`).then(res => res.data);
  }

  async deleteRole(id: string) {
    return this.apiClient.delete(`${this.authApiExternal}auth/roles/${id}`).then(res => res.data);
  }

  async login(email: string, password: string): Promise<Observable<User>> {
    let result, userToReturn: User
    try {


      let authLoginResponse = await this.apiClient.post<AuthResponse>(`${this.authApiExternal}auth/login`, { email, password }).then(res => res.data);
      authLoginResponse.user.picData = new ArrayBuffer(0)
      this.setUser(authLoginResponse.user);
      this.tokenStorage.saveToken(authLoginResponse.token);
      console.log('login: user token length: ', authLoginResponse.token.length);
      this.tokenStorage.saveUser(authLoginResponse.user);

      result = await this.apiClient.post(`${this.authApiExternal}auth/getpermissions`, { email, password }).then(res => res.data);
      let permission: Permission[] = result as unknown as Permission[];
      this.tokenStorage.saveUserActionsPermitted(permission);
      userToReturn = authLoginResponse.user;
      return of(authLoginResponse.user);

    }
    catch (e: any) {
      if (e.response.status == 401) {
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
        roles: [],
        token: "",
        enabled: false,
        picData: new ArrayBuffer(0),
        doctor_id: "",
        name: { first: "", last: "" }
      }
      return of(user)
    }
  }

  async register(
    fullname: string,
    email: string,
    password: string,
    repeatPassword: string,
    picture: string
  ): Promise<Observable<User>> {
    return this.http
      .post<AuthResponse>(`${this.authApiExternal}auth/register`, {
        fullname,
        email,
        password,
        repeatPassword,
        picture
      })
      .pipe(
        tap(async ({ token, user }) => {
          this.setUser(user);

          let result = await this.apiClient.post(`${this.authApiExternal}auth/getpermissions`, { email, password }).then(res => res.data);
          let permission: Permission[] = result as unknown as Permission[];
          this.tokenStorage.saveUserActionsPermitted(permission);
          this.tokenStorage.saveToken(token);
          console.log('register: user token length: ', token.length)
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
      user.isAdmin = user.roles?.includes('admin');
    }

    this.user$.next(user);
  }

  setUserEx(user: User | null): void {
    this.tokenStorage.saveUser(user!)
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

  handleError(error: HttpErrorResponse): any {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    alert(error.error.message);
    throw error.error


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

    return this.http.get<AuthResponse>(`${this.authApiExternal}auth/me`).pipe(
      tap(({ user }) =>
        this.setUser(user)),
      map(x => x.user)
    ).pipe(
      catchError(err => { this.handleError(err); return of(err) })
    );
  }

  async registerwithoutlogin(fullname: string,
    email: string,
    password: string,
    repeatPassword: string,
    picture: string): Promise<any> {
    console.log('registerwithoutlogin')
    let token = this.tokenStorage.getToken()
    let url = `${this.authApiExternal}auth/registerwithoutlogin`
    let result = await this.apiClient.post(url, {
      fullname, email, password, repeatPassword, picture
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });



    if (result.data.token) {
      this.tokenStorage.saveToken(result.data.token)
    }

    let user = this.tokenStorage.getUser()

    if (user) {
      user.roles = result?.data?.user?.roles!
      user.token = result?.data?.token!
      console.log('registerwithoutlogin: user token length: ', user.token.length)
      this.tokenStorage.saveUser(user)

      let permissionsByRole = await this.apiClient.post(`${this.authApiExternal}auth/getpermissionsbyrole`, user.roles).then(res => res.data);
      this.tokenStorage.saveUserActionsPermitted(permissionsByRole)
    }
    else {

      console.log('registerwithoutlogin: user token length: ', result?.data?.token!.length)


      let permissionsByRole = await this.apiClient.post(`${this.authApiExternal}auth/getpermissionsbyrole`, result?.data?.user?.roles!).then(res => res.data);

      this.tokenStorage.saveUserActionsPermitted(permissionsByRole)
    }
    return result;
  }

  getJwt() {
    return this.tokenStorage.getToken()
  }

  getGoogleToken() {
    return this.tokenStorage.getGoogleIdToken()
  }

  async signOut(): Promise<any> {
    let token = this.tokenStorage.getToken()
    let result = await this.apiClient.post(`${this.authApiExternal}auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });

    if (result.data.message == "ok") {
      this.tokenStorage.signOut()
    }

    return { "message": result.data.message }
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
