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

  async handleGoogleAuthResponse(response: any) {
    if (response && response.credential) {
      this.tokenStorage.saveGoogleIdToken(response.credential)
      let googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
      await Axios.get(`${googleUserInfoUrl}${response.credential}`)
        .then(async data => {
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
                picture: googleUser.picture,
                token: "",
                enabled: false,
                picData: new ArrayBuffer(0),
                doctor_id: '',
                name: { first: "", last: "" }
              }
              try {
                // Create local user for this google user
                let localUserCreatedForGoogleUser = await this.authService.registerwithoutlogin(googleUser.name, googleUser.email, "test123", "test123", googleUser.picture);

                user.roles = localUserCreatedForGoogleUser?.data?.user?.roles!
                user.token = localUserCreatedForGoogleUser?.data?.token!
                this.tokenStorage.saveUser(user)
              }
              catch (Exception) {
                console.error(Exception)
              }

              this.tokenStorage.saveUser(user)
            }
          }
        });




      this.router.navigateByUrl('/');
    }
  }

  googleLoginInit() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "<google_client_id>",
      callback: this.handleGoogleAuthResponse.bind(this),
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

  ngOnInit() {


    let user: User;

    this.authService.getUser().subscribe(async x => {

      user = x!

      await this.authService.getProfilePic(x?._id!).then((res) => {



        if (user != null) {
          user.picData = res
        }
      });

      this.authService.setUserEx(user)

    });
  }

  async doLogin() {
    let result = await this.login();

    if (result == true) {
      this.authService.getUser().subscribe(async x => {
        if (x?.roles?.includes("doctor")) {
          this.router.navigateByUrl('/manageschedule');
          return
        }
        else {
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  async login(): Promise<boolean> {
    try {
      await new Promise<void>(async (resolve, reject) => {
        (await this.authService.login(this.email!, this.password!)).subscribe({
          next: (v) => {
            console.log(v);
            resolve();
          },
          error: (e) => {
            console.error(e);
            if (e?.status == 401) {
              alert("Either user name or password or both are incorrect. Please input valid username and password.");
            }
            reject(e);
          },
          complete: () => { console.info('complete'); }
        });
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
