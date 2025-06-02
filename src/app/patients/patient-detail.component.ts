import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { Patient } from '../models/othermodels';
import { PermissionRequest, AuditLogRequest, FieldOldValueNewValue } from '../models/models';
import { AuthService } from '../shared/services';


@Component({
    selector: 'patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['././patient.component.css']
})
export class PatientDetailComponent implements OnInit {
    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "patients" }
    auditLogFirstName: FieldOldValueNewValue = {
        field: "FirstName",
        newvalue: "",
        oldvalue: ""
    }
    patientDetailForm: FormGroup;
    async updatePatient() {
        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.apiService.update('patients', this.patientDetailForm.value.id, this.patientDetailForm.value);
            alert('Patient details saved successfully.');
            this.router.navigate(['/patients']);

            this.authService.getUser().subscribe(async x => {
                let req: AuditLogRequest = {
                    action: "update",
                    createdAt: new Date(),
                    email: x?.email!,
                    entity: "patient",
                    valueChanged: {
                        field: this.auditLogFirstName.field,
                        newvalue: this.auditLogFirstName.newvalue,
                        oldvalue: this.auditLogFirstName.oldvalue
                    },
                    pageName: "patients",
                }

                await this.authService.createAuditLog(req!).then((res) => {
                    
                });
            })


        }
        else {
            alert('You are not authorized to modify an existing patient. Please contact system administrator so they can give you permissions.');
        }
    }
    @Input() public patient: Patient | undefined;
    oldValue: string = '';
    newValue: string = '';

    onFirstNameChange(newValue: string): void {
        this.oldValue = this.patient?.name.first!;
        this.newValue = newValue;
        this.auditLogFirstName.newvalue = this.newValue;
        this.auditLogFirstName.oldvalue = this.oldValue;
    }

    error: any;
    navigated = false; // true if navigated here
    patientForm: any;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.patientDetailForm = this.fb.group({
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
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];

            if (id !== undefined) {
                this.navigated = true;
                await this.apiService.getOne("patients", id).then((value: any) => {
                    this.patient = value[0]!

                    this.patientDetailForm = this.fb.group({
                        id: value[0].id,
                        firstName: this.patient?.name.first,
                        lastName: this.patient?.name.last,
                        dob: this.patient?.dob,
                        gender: this.patient?.gender,
                        phone: this.patient?.contact.phone,
                        email: this.patient?.contact.email,
                        address: this.patient?.contact.address,
                    });
                })
            } else {
                this.navigated = false;
                this.patient = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    appointments: [],
                    medical_history: [],
                    _id: ""


                }
            }
        }
        else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== undefined) {
                this.navigated = true;
                (await this.apiService.getOne("patients", id!)).subscribe((patient: Patient) => (this.patient = patient));
            } else {
                this.navigated = false;
                this.patient = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    appointments: [],
                    medical_history: [],
                    _id: ""


                }
            }
        }
    }




}
