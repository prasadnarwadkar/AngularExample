import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { PermissionRequest } from '../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'doctor-detail-new',
    templateUrl: './doctor-detail-new.component.html',
    styleUrls: ['././doctor.component.css']
})
export class DoctorDetailNewComponent implements OnInit {
    detailNewForm: FormGroup;
    createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "doctors" }
    
    
    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {
        this.detailNewForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            dob: [''],
            gender: [''],
            phone: [''],
            email: [''],
            address: [''],
            specialization:[''],
            qualification:['']
        });
    }


    async ngOnInit(): Promise<void> {

    }

    async save(): Promise<any> {
        if (await this.authService.hasPermission(this.createPermissionRequest.action, this.createPermissionRequest.pageName)) {
            

            if (this.detailNewForm.value.firstName.length > 0) {

                try {
                    await this.apiService.create("doctors", this.detailNewForm.value).then((res) => {
                        alert('Doctor details saved successfully')
                        this._snackBar.open('Doctor details saved successfully', '', {
                            duration: 2000,
                        });
                        this.router.navigate(['/doctors']);
                    });
                }
                catch (error) {
                    alert(error)
                }
            }
            else {
                alert('Name of the Doctor can\'t be blank');

            }
        }
        else{
            alert('You are not authorized to register a new doctor. Please contact system administrator so they can give you permissions.');
        }
    }
}
