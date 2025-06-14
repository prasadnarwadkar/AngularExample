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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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
                entity_id: this.patient?.id!,
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


    onGenderChange(newValue: string) {
        this.auditLogGender.newvalue = newValue;
        this.auditLogGender.oldvalue = this.patient?.gender!;
    }

    onFirstNameChange(newValue: string): void {
        this.auditLogFirstName.newvalue = newValue;
        this.auditLogFirstName.oldvalue = this.patient?.name.first!;
    }

    onLastNameChange(newValue: string): void {
        this.auditLogLastName.newvalue = newValue;
        this.auditLogLastName.oldvalue = this.patient?.name.last!;
    }

    onDobChange(newValue: string): void {
        this.auditLogDob.newvalue = newValue;
        this.auditLogDob.oldvalue = this.patient?.dob!;
    }

    onPhoneChange(newValue: string): void {
        this.auditLogPhone.newvalue = newValue;
        this.auditLogPhone.oldvalue = this.patient?.contact?.phone!;
    }

    onAddressChange(newValue: string): void {
        this.auditLogAddress.newvalue = newValue;
        this.auditLogAddress.oldvalue = this.patient?.contact?.address!;
    }

    onEmailChange(newValue: string): void {
        this.auditLogEmail.newvalue = newValue;
        this.auditLogEmail.oldvalue = this.patient?.contact?.email!;
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
