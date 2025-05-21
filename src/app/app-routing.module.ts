import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { OnlyAdminUsersGuard } from './admin/admin-user-guard';
import { CounterComponent } from './counter/counter.component';
import { PatientsComponent } from './patients/patient.component';
import { PatientDetailComponent } from './patients/patient-detail.component';
import { PatientDetailNewComponent } from './patients/patient-detail-new.component';

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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[OnlyAdminUsersGuard]
})
export class AppRoutingModule { }
