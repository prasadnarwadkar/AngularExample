import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { OnlyAdminUsersGuard } from './admin/admin-user-guard';
import { CounterComponent } from './counter/counter.component';
import { PatientsComponent } from './patients/patient.component';
import { PatientDetailComponent } from './patients/patient-detail.component';
import { PatientDetailNewComponent } from './patients/patient-detail-new.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail.component';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailComponent } from './roles/role-detail.component';
import { RoleActionMapComponent } from './roleactionmap/roleactionmap.component';
import { RoleActionMapDetailComponent } from './roleactionmap/roleactionmap-detail.component';
import { RoleActionMapNewComponent } from './roleactionmap/roleactionmap-detail-new.component';
import { ForgotPasswordComponent } from './users/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password.component';
import { AuditLogsComponent } from './auditlogs/auditlogs.component';
import { DoctorsComponent } from './doctors/doctor.component';
import { DoctorDetailComponent } from './doctors/doctor-detail.component';
import { DoctorDetailNewComponent } from './doctors/doctor-detail-new.component';
import { SendEmailComponent } from './users/send-email.component';
import { DoctorManageScheduleComponent } from './doctors/doctor-manageschedule.component';
import { HelpComponent } from './help/help.component';
import { RecordDetailNewComponent } from './medical-records/record-detail-new.component';
import { RecordComponent } from './medical-records/record.component';
import { RecordDetailComponent } from './medical-records/record-detail.component';

const routes: Routes = [
  {
    path: 'auth',
    
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    canActivate: [OnlyAdminUsersGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  { path: '',   redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patient-detail/:id', component: PatientDetailComponent,canActivate: [AuthGuard] },
  { path: 'counter-component', component: CounterComponent },
  { path: 'patients', component: PatientsComponent,canActivate: [AuthGuard] },
  { path: 'newpatient', component: PatientDetailNewComponent,canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent,canActivate: [AuthGuard] },
  { path: 'user-detail/:id', component: UserDetailComponent,canActivate: [AuthGuard] },
  { path: 'roles', component: RolesComponent,canActivate: [AuthGuard] },
  { path: 'role-detail/new', component: RoleDetailComponent,canActivate: [AuthGuard] },
  { path: 'roleactionmaps-detail/:role/:page', component: RoleActionMapDetailComponent,canActivate: [AuthGuard] },
  { path: 'roleactionmaps', component: RoleActionMapComponent,canActivate: [AuthGuard] },
  { path: 'newroleactionmap', component: RoleActionMapNewComponent,canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'sendemail', component: SendEmailComponent },
  { path: 'auditlogs', component: AuditLogsComponent,canActivate: [AuthGuard] },
  { path: 'doctor-detail/:id', component: DoctorDetailComponent,canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorsComponent,canActivate: [AuthGuard] },
  { path: 'newdoctor', component: DoctorDetailNewComponent,canActivate: [AuthGuard] },
  { path: 'manageschedule', component: DoctorManageScheduleComponent,canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent },
   { path: 'record-detail/:id', component: RecordDetailComponent,canActivate: [AuthGuard] },
  { path: 'records', component: RecordComponent,canActivate: [AuthGuard] },
  { path: 'newrecord', component: RecordDetailNewComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[OnlyAdminUsersGuard]
})
export class AppRoutingModule { }
