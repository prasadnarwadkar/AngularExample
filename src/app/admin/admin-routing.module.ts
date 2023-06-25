import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [OnlyAdminUsersGuard],
    children: [{
      path: '',
      component: AdminComponent,
      canActivate: [OnlyAdminUsersGuard]
    }]
  }
];

export const AdminRoutingModule = RouterModule.forChild(routes);
