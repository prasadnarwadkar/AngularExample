import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/services/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderService } from './services/loader.service';
import { PatientsComponent } from './patients/patient.component';
import { PatientDetailComponent } from './patients/patient-detail.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { PatientDetailNewComponent } from './patients/patient-detail-new.component';
import { GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { MyDisableIfUnauthorizedDirective } from './directives/disable';
import { UserDetailComponent } from './users/user-detail.component';
import { UsersComponent } from './users/users.component';
import { MatListModule } from '@angular/material/list';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailComponent } from './roles/role-detail.component';
import { RoleActionMapComponent } from './roleactionmap/roleactionmap.component';
import { RoleActionMapDetailComponent } from './roleactionmap/roleactionmap-detail.component';
import { RoleActionMapNewComponent } from './roleactionmap/roleactionmap-detail-new.component';
import { ForgotPasswordComponent } from './users/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuditLogsComponent } from './auditlogs/auditlogs.component';
import { DoctorDetailComponent } from './doctors/doctor-detail.component';
import { DoctorsComponent } from './doctors/doctor.component';
import { DoctorDetailNewComponent } from './doctors/doctor-detail-new.component';

export function appInitializerFactory(authService: AuthService) {
  return () => authService.checkTheUserOnTheFirstLoad();
}

@NgModule({

  declarations: [
    AppComponent,
    HeaderComponent,
    PatientDetailComponent,
    PatientsComponent,
    PatientDetailNewComponent,
    MyDisableIfUnauthorizedDirective,
    UserDetailComponent,
    UsersComponent,
    RolesComponent,
    RoleDetailComponent,
    RoleActionMapComponent,
    RoleActionMapDetailComponent,
    RoleActionMapNewComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AuditLogsComponent,
    DoctorDetailComponent,
    DoctorsComponent,
    DoctorDetailNewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule
  ],
  providers: [ SocialAuthService, 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('<Google client id here>'),
          },
        ],
        onError: (err) => console.error(err),
      } as SocialAuthServiceConfig,
    },

    { provide: Window, useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AuthService, LoaderService],
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [PatientsComponent, 
    PatientDetailComponent, 
    PatientDetailNewComponent, 
    UsersComponent, 
    UserDetailComponent, 
    RolesComponent, 
    RoleDetailComponent,
  AuditLogsComponent]
})
export class AppModule { }
