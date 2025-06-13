import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { PermissionRequest } from '../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'patient-detail-new',
    templateUrl: './patient-detail-new.component.html',
    styleUrls: ['././patient.component.css']
})
export class PatientDetailNewComponent implements OnInit {
    patientDetailNewForm: FormGroup;
    createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "patients" }

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {
        this.patientDetailNewForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            dob: [''],
            gender: [''],
            phone: [''],
            email: [''],
            address: ['']
        });
    }


    async ngOnInit(): Promise<void> {

    }

    async save(): Promise<any> {
        if (await this.authService.hasPermission(this.createPermissionRequest.action, this.createPermissionRequest.pageName)) {


            if (this.patientDetailNewForm.value.firstName.length > 0) {

                try {
                    await this.apiService.create("patients", this.patientDetailNewForm.value).then((res) => {
                        alert('Patient details saved successfully')
                        this._snackBar.open('Patient details saved successfully', '', {
                            duration: 2000,
                        });
                        this.router.navigate(['/patients']);
                    });
                }
                catch (error) {
                    alert(error)
                }
            }
            else {
                alert('Name of the Patient can\'t be blank');

            }
        }
        else {
            alert('You are not authorized to register a new patient. Please contact system administrator so they can give you permissions.');
        }
    }
}
