import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';
import { Role } from '../models/othermodels';
import { User } from '../shared/interfaces';
import { environment } from 'src/environment/environment.development';

@Component({
    selector: 'send-email',
    templateUrl: '././send-email.component.html',
    styleUrls: ['././user.component.css']
})
export class SendEmailComponent implements OnInit {
    userDetailForm: FormGroup;
    allRoles: Role[] = [];
    isEmailDisabled: boolean = true;
    token: string = ""
    async sendEmail() {
        if (this.userDetailForm.value.subject.length < 1
            || this.userDetailForm.value.emailbody.length < 1
        ) {
            alert("Subject and body must not be blank")
            return
        }

        try {
            let from = this.userDetailForm.value.from;
            if (from?.length < 1) {
                from = this.user?.email
            }

            // todo. Enable email in env settings when mailgun domain is set to custom
            // domain. 
            if (environment.emailEnabled) {
                await this.authService.sendEmail(environment.adminEmail, from,
                    `Email From ${from}: ${this.userDetailForm.value.subject}`,
                    this.userDetailForm.value.emailbody).then((res) => {
                        if (res == "Email sent.") {
                            alert("Email has been sent to the administrator.")
                            this.router.navigateByUrl('/');
                        }
                        else {
                            alert("Failure while sending email.")
                            this.router.navigateByUrl('/');
                        }
                    }).catch((err) => {
                        console.log(JSON.stringify(err))
                        alert(err.response.data)
                    });
            }
            else{
                alert("Email is not enabled in this trial version.")
            }
        }

        catch (error) {
            alert(error)
        }
    }
    @Input() public user: User | undefined;

    error: any;
    navigated = false; // true if navigated here

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.userDetailForm = this.fb.group({
            subject: [''],
            emailbody: [''],
            from: ['']
        });


    }

    async ngOnInit(): Promise<void> {
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });

        if (this.route.snapshot.params != undefined) {
            const token = this.route.snapshot.params['token'];

            if (token !== undefined) {
                this.navigated = true;

                this.token = token

                this.userDetailForm = this.fb.group({
                    subject: [''],
                    emailbody: [''],
                    from: ['']
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
                    subject: [''],
                    emailbody: [''],
                    from: ['']
                });
            } else {
                this.navigated = false;
                this.token = ""
            }
        }
    }


}
