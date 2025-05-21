import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss', './login.component.css'],

})
export class LoginComponent {
  email: string | null = null;
  password: string | null = null;


  constructor(private router: Router, private authService: AuthService) { }

  login(): void {

    this.authService.login(this.email!, this.password!).subscribe(() => {
      this.router.navigateByUrl('/');
    },
      (error) => {
        if (error?.status == 401) {
          alert("Either user name or password or both are incorrect. Please input valid username and password.");
        }
      })
  }
}
