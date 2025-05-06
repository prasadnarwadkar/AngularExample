import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './hero-list/heroes.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { OnlyAdminUsersGuard } from './admin/admin-user-guard';
import { CounterComponent } from './counter/counter.component';

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
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',title:"Dashboard", component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'detail/:id', component: HeroDetailComponent,canActivate: [AuthGuard] },
  { path: 'detail', component: HeroDetailComponent,canActivate: [AuthGuard] },
  { path: 'heroes', component: HeroesComponent,canActivate: [AuthGuard] },
  { path: 'counter-component', component: CounterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[OnlyAdminUsersGuard]
})
export class AppRoutingModule { }
