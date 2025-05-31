import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/interfaces';

import { AuthService } from '../shared/services';
import axios from 'axios';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Input() title: String | null = null;
  await: any;

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "<google_client_id>",
      auto_select: false,
      cancel_on_tap_outside: true,

    });
  }

  async logout(): Promise<void> {
    try {

      let result = await this.authService.signOut();
      console.log("revoking google auth")
      
      // @ts-ignore
      google.accounts.id.disableAutoSelect();

      window.location.reload()
    } catch (Exception) {
      console.error(Exception)
    }
  }
}
