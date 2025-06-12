import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services';
import { TokenStorage } from 'src/app/shared/services/auth/token.storage';
import { User } from 'src/app/shared/interfaces';
import Axios from 'axios';
import { GoogleUser } from 'src/app/models/google-user';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../auth.component.scss', './login.component.css'],

})
export class ProfileComponent {
  email: string | null = null;
  password: string | null = null;
  currentFile?: File;
  message = '';

  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorage) { }

  upload(): void {
    if (this.currentFile) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const form = new FormData();
        this.authService.getUser().subscribe(async x => {

          form.append("data", x?._id!)
          const blob = new Blob([fileReader.result!], { type: 'application/octet-stream' });
          form.append('file', blob, this.currentFile?.name);

          await this.authService.uploadProfilePic(form).then((res) => {
            if (res == 'OK') {
              alert("Profile pic has been updated. Please sign out and sign back in to see your updated profile.")
            }
            else {
              alert("There was an error while updating your Profile picture")
            }
          });
        });


      };
      fileReader.readAsArrayBuffer(this.currentFile);
    }
  }

  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
  }
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
                doctor_id:'',
                name:{first:"", last:""}
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

  ngOnInit() {
    let user: User;

    this.authService.getUser().subscribe(async x => {
      if (x == null || x == undefined){
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

}
