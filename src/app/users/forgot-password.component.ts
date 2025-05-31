import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { MatSelectionListChange } from '@angular/material/list';
import { Role } from '../models/othermodels';
import { User } from '../shared/interfaces';


@Component({
    selector: 'forgot-password-detail',
    templateUrl: '././forgot-password.component.html',
    styleUrls: ['././user.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    userDetailForm: FormGroup;
    allRoles: Role[] = [];
    isEmailDisabled: boolean = true;
    async forgotPassword() {
        if (this.userDetailForm.value.email.length < 1) {
            alert("Email must not be blank")
            return
        }

        if (this.userDetailForm.value.email.length > 0) {
            try {
                alert("If the email you have entered matches any email in our database, we will send an email to you. Please check your inbox.")
                await this.authService.forgotPassword(this.userDetailForm.value.email).then((res) => {
                    alert("Reset Password email has been sent to the specified email address. Please check your email.")
                });
            }

            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Email can\'t be blank');

        }
    }
    @Input() public user: User | undefined;

    error: any;
    navigated = false; // true if navigated here

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.userDetailForm = this.fb.group({
            email: ['']
        });
    }

    async ngOnInit(): Promise<void> {
        
    }
}
