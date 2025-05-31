import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';
import { Role } from '../models/othermodels';
import { User } from '../shared/interfaces';


@Component({
    selector: 'reset-password-detail',
    templateUrl: '././reset-password.component.html',
    styleUrls: ['././user.component.css']
})
export class ResetPasswordComponent implements OnInit {
    userDetailForm: FormGroup;
    allRoles: Role[] = [];
    isEmailDisabled: boolean = true;
    token:string= ""
    async resetPassword() {
        if (this.userDetailForm.value.password.length < 1) {
            alert("Password must not be blank")
            return
        }

        if (this.userDetailForm.value.password.length > 0) {
            try {
                await this.authService.resetPassword(this.token, this.userDetailForm.value.password).then((res) => {
                    alert("Password has been reset. Please login with your new password.")
                }).catch((err)=>{
                    console.log(JSON.stringify(err))
                    alert(err.response.data)
                });
            }

            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Password can\'t be blank');

        }
    }
    @Input() public user: User | undefined;

    error: any;
    navigated = false; // true if navigated here

    constructor(
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.userDetailForm = this.fb.group({
            password: ['']
        });
    }

    async ngOnInit(): Promise<void> {
        if (this.route.snapshot.params != undefined) {
            const token = this.route.snapshot.params['token'];

            if (token !== undefined) {
                this.navigated = true;

                this.token = token

                this.userDetailForm = this.fb.group({
                    password: ['']
                });
            } else {
                this.navigated = false;
                this.token = ""
            }
        }
        else {
            const token = this.route.snapshot.paramMap.get('token');
            if (token !== undefined) {
                this.token = token!

                this.userDetailForm = this.fb.group({
                    password: ['']
                });
            } else {
                this.navigated = false;
                this.token = ""
            }
        }
    }

    
}
