import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';

@Component({
    selector: 'patient-detail-new',
    templateUrl: './patient-detail-new.component.html',
    styleUrls: ['././patient.component.css']
})
export class PatientDetailNewComponent implements OnInit {
    patientDetailNewForm: FormGroup;

    constructor(
        private router: Router,
        private apiService: ApiService,

        private route: ActivatedRoute,
        private fb: FormBuilder
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
        console.log(this.patientDetailNewForm.value)

        if (this.patientDetailNewForm.value.firstName.length > 0) {

            try {
                await this.apiService.create("patients", this.patientDetailNewForm.value).then((res) => {
                    this.router.navigate(['/patients']);
                });
            }
            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Name of the hero can\'t be blank');

        }
    }
}
