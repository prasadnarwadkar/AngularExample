import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './hero-list/heroes.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { OnlyAdminUsersGuard } from './admin/admin-user-guard';
import { CounterComponent } from './counter/counter.component';
import { PatientsComponent } from './patients/patient.component';
import { PatientDetailComponent } from './patients/patient-detail.component';

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
  { path: 'dashboard',title:"Dashboard", component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'detail/:id', component: HeroDetailComponent,canActivate: [AuthGuard] },
  { path: 'patient-detail/:id', component: PatientDetailComponent,canActivate: [AuthGuard] },
  { path: 'detail', component: HeroDetailComponent,canActivate: [AuthGuard] },
  { path: 'heroes', component: HeroesComponent,canActivate: [AuthGuard] },
  { path: 'counter-component', component: CounterComponent },
  { path: 'patients', component: PatientsComponent,canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[OnlyAdminUsersGuard]
})
export class AppRoutingModule { }
