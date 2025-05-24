import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';

@Component({
    selector: 'role-detail',
    templateUrl: '././role-detail.component.html',
    styleUrls: ['././role.component.css']
})
export class RoleDetailComponent implements OnInit {
    roleDetailForm: FormGroup;

    async createRole() {
        if (this.roleDetailForm.value.role.length < 1) {
            alert("Role name must not be blank")
            return
        }

        if (this.roleDetailForm.value.role.length > 0) {
            try {
                await this.authService.createRole(this.roleDetailForm.value.role!).then((res) => {
                    this.router.navigate(['/roles']);
                });
            }

            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Role can\'t be blank');

        }
    }


    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.roleDetailForm = this.fb.group({
            role: ['']
        });
    }

    async ngOnInit(): Promise<void> {

    }


}
