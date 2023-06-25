import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/interfaces';

import { AuthService } from '../shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Input() title : String | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl('/auth/login');
  }
}
