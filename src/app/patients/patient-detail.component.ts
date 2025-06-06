import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { Patient, User } from '../models/othermodels';
import { PermissionRequest, AuditLogRequest, FieldOldValueNewValue } from '../models/models';
import { AuthService } from '../shared/services';


@Component({
    selector: 'patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['././patient.component.css']
})
export class PatientDetailComponent implements OnInit {
    auditLogGender: FieldOldValueNewValue = {
        field: "Gender",
        newvalue: "",
        oldvalue: ""
    };

    onGenderChange(newValue: string) {
        this.oldValue = this.patient?.gender!;
        this.newValue = newValue;
        this.auditLogGender.newvalue = this.newValue;
        this.auditLogGender.oldvalue = this.oldValue;
    }

    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "patients" }
    auditLogFirstName: FieldOldValueNewValue = {
        field: "FirstName",
        newvalue: "",
        oldvalue: ""
    }
    patientDetailForm: FormGroup;
    user: User | null | undefined;

    auditLogLastName: FieldOldValueNewValue = {
        field: "LastName",
        newvalue: "",
        oldvalue: ""
    };

    auditLogPhone: FieldOldValueNewValue = {
        field: "Phone",
        newvalue: "",
        oldvalue: ""
    };

    auditLogDob: FieldOldValueNewValue = {
        field: "DateOfBirth",
        newvalue: "",
        oldvalue: ""
    };

    auditLogAddress: FieldOldValueNewValue = {
        field: "Address",
        newvalue: "",
        oldvalue: ""
    };

    auditLogEmail: FieldOldValueNewValue = {
        field: "Email",
        newvalue: "",
        oldvalue: ""
    };

    async updatePatient() {
        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.apiService.update('patients', this.patientDetailForm.value.id, this.patientDetailForm.value);
            alert('Patient details saved successfully.');
            this.router.navigate(['/patients']);

            let req: AuditLogRequest = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
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

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogLastName.field,
                    newvalue: this.auditLogLastName.newvalue,
                    oldvalue: this.auditLogLastName.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogDob.field,
                    newvalue: this.auditLogDob.newvalue,
                    oldvalue: this.auditLogDob.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogPhone.field,
                    newvalue: this.auditLogPhone.newvalue,
                    oldvalue: this.auditLogPhone.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogAddress.field,
                    newvalue: this.auditLogAddress.newvalue,
                    oldvalue: this.auditLogAddress.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogEmail.field,
                    newvalue: this.auditLogEmail.newvalue,
                    oldvalue: this.auditLogEmail.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "patient",
                valueChanged: {
                    field: this.auditLogGender.field,
                    newvalue: this.auditLogGender.newvalue,
                    oldvalue: this.auditLogGender.oldvalue
                },
                pageName: "patients",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });
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

    onLastNameChange(newValue: string): void {
        this.oldValue = this.patient?.name.last!;
        this.newValue = newValue;
        this.auditLogLastName.newvalue = this.newValue;
        this.auditLogLastName.oldvalue = this.oldValue;
    }

    onDobChange(newValue: string): void {
        this.oldValue = this.patient?.dob!;
        this.newValue = newValue;
        this.auditLogDob.newvalue = this.newValue;
        this.auditLogDob.oldvalue = this.oldValue;
    }

    onPhoneChange(newValue: string): void {
        this.oldValue = this.patient?.contact.phone!;
        this.newValue = newValue;
        this.auditLogPhone.newvalue = this.newValue;
        this.auditLogPhone.oldvalue = this.oldValue;
    }

    onAddressChange(newValue: string): void {
        this.oldValue = this.patient?.contact.address!;
        this.newValue = newValue;
        this.auditLogAddress.newvalue = this.newValue;
        this.auditLogAddress.oldvalue = this.oldValue;
    }

    onEmailChange(newValue: string): void {
        this.oldValue = this.patient?.contact.email!;
        this.newValue = newValue;
        this.auditLogEmail.newvalue = this.newValue;
        this.auditLogEmail.oldvalue = this.oldValue;
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
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });
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
