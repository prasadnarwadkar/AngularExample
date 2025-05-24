import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services';
import { TokenStorage } from 'src/app/shared/services/auth/token.storage';
import { User } from 'src/app/shared/interfaces';
import Axios from 'axios';
import { GoogleUser } from 'src/app/models/google-user';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss', './login.component.css'],

})
export class LoginComponent {
  email: string | null = null;
  password: string | null = null;


  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorage) { }

  async handleCredentialResponse(response: any) {
    if (response && response.credential) {
      this.tokenStorage.saveGoogleIdToken(response.credential)
      let googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
      await Axios.get(`${googleUserInfoUrl}${response.credential}`)
        .then(data => {
          if (data.status === 200) {
            let googleUser: GoogleUser = data.data as unknown as GoogleUser

            if (googleUser) {
              let user: User = {
                _id: googleUser.sub,
                fullname: googleUser.name,
                createdAt: new Date().toDateString(),
                roles: [],
                isAdmin: false,
                email: googleUser.email,
                picture: googleUser.picture
              }

              this.tokenStorage.saveUser(user)
            }
          }
        });




      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "<client_id>",
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,

    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("google-button"),
      { theme: "outline", size: "large", width: "100%" }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => { });
  }

  async login(): Promise<void> {

    await (await this.authService.login(this.email!, this.password!)).subscribe(() => {
      this.router.navigateByUrl('/');
    },
      (error) => {
        if (error?.status == 401) {
          alert("Either user name or password or both are incorrect. Please input valid username and password.");
        }
      })
  }
}
