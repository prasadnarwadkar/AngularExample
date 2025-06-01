import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';
import { RoleAndDesc, RoleRequest } from '../models/models';

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
                let roleAndDesc: RoleRequest = {
                    role: this.roleDetailForm.value.role,
                    desc: this.roleDetailForm.value.desc
                }
                await this.authService.createRole(roleAndDesc!).then((res) => {
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
            role: [''],
            desc:['']
        });
    }

    async ngOnInit(): Promise<void> {

    }


}
