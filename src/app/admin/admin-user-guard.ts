import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../shared/services';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    console.log('OnlyAdminUsersGuard.canActivate()');
    return this.authService.getUser().pipe(map(user => {
      
      if (user !== null && 
        user.isAdmin) {
        return true;
      }

      return false;
    }));
  }
}
