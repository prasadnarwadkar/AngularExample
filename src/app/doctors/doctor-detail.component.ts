import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { Doctor, User } from '../models/othermodels';
import { PermissionRequest, AuditLogRequest, FieldOldValueNewValue } from '../models/models';
import { AuthService } from '../shared/services';


@Component({
    selector: 'doctor-detail',
    templateUrl: './doctor-detail.component.html',
    styleUrls: ['././doctor.component.css']
})
export class DoctorDetailComponent implements OnInit {
    auditLogGender: FieldOldValueNewValue = {
        field: "Gender",
        newvalue: "",
        oldvalue: ""
    };

    onGenderChange(newValue: string) {
        this.oldValue = this.doctor?.gender!;
        this.newValue = newValue;
        this.auditLogGender.newvalue = this.newValue;
        this.auditLogGender.oldvalue = this.oldValue;
    }

    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "doctors" }
    auditLogFirstName: FieldOldValueNewValue = {
        field: "FirstName",
        newvalue: "",
        oldvalue: ""
    }
    detailForm: FormGroup;
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

    async update() {
        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.apiService.update('doctors', this.detailForm.value.id, this.detailForm.value);
            alert('Doctor details saved successfully.');
            this.router.navigate(['/doctors']);

            let req: AuditLogRequest = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogFirstName.field,
                    newvalue: this.auditLogFirstName.newvalue,
                    oldvalue: this.auditLogFirstName.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogLastName.field,
                    newvalue: this.auditLogLastName.newvalue,
                    oldvalue: this.auditLogLastName.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogDob.field,
                    newvalue: this.auditLogDob.newvalue,
                    oldvalue: this.auditLogDob.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogPhone.field,
                    newvalue: this.auditLogPhone.newvalue,
                    oldvalue: this.auditLogPhone.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogAddress.field,
                    newvalue: this.auditLogAddress.newvalue,
                    oldvalue: this.auditLogAddress.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogEmail.field,
                    newvalue: this.auditLogEmail.newvalue,
                    oldvalue: this.auditLogEmail.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });

            req = {
                action: "update",
                createdAt: new Date(),
                email: this.user?.email!,
                entity: "doctor",
                valueChanged: {
                    field: this.auditLogGender.field,
                    newvalue: this.auditLogGender.newvalue,
                    oldvalue: this.auditLogGender.oldvalue
                },
                pageName: "doctors",
            }

            await this.authService.createAuditLog(req!).then((res) => {

            });
        }
        else {
            alert('You are not authorized to modify an existing doctor. Please contact system administrator so they can give you permissions.');
        }
    }
    @Input() public doctor: Doctor | undefined;
    oldValue: string = '';
    newValue: string = '';

    onFirstNameChange(newValue: string): void {
        this.oldValue = this.doctor?.name.first!;
        this.newValue = newValue;
        this.auditLogFirstName.newvalue = this.newValue;
        this.auditLogFirstName.oldvalue = this.oldValue;
    }

    onLastNameChange(newValue: string): void {
        this.oldValue = this.doctor?.name.last!;
        this.newValue = newValue;
        this.auditLogLastName.newvalue = this.newValue;
        this.auditLogLastName.oldvalue = this.oldValue;
    }

    onDobChange(newValue: string): void {
        this.oldValue = this.doctor?.dob!;
        this.newValue = newValue;
        this.auditLogDob.newvalue = this.newValue;
        this.auditLogDob.oldvalue = this.oldValue;
    }

    onPhoneChange(newValue: string): void {
        this.oldValue = this.doctor?.contact.phone!;
        this.newValue = newValue;
        this.auditLogPhone.newvalue = this.newValue;
        this.auditLogPhone.oldvalue = this.oldValue;
    }

    onAddressChange(newValue: string): void {
        this.oldValue = this.doctor?.contact.address!;
        this.newValue = newValue;
        this.auditLogAddress.newvalue = this.newValue;
        this.auditLogAddress.oldvalue = this.oldValue;
    }

    onEmailChange(newValue: string): void {
        this.oldValue = this.doctor?.contact.email!;
        this.newValue = newValue;
        this.auditLogEmail.newvalue = this.newValue;
        this.auditLogEmail.oldvalue = this.oldValue;
    }

    error: any;
    navigated = false; // true if navigated here


    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });

        this.detailForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            dob: [''],
            gender: [''],
            phone: [''],
            email: [''],
            address: [''],
            specialization: [''],
            qualification: ['']
        });
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];
            await this.apiService.getOne("doctors", id).then((value: any) => {
                this.doctor = value[0]!
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];

            if (id !== undefined) {
                this.navigated = true;
                await this.apiService.getOne("doctors", id).then((value: any) => {
                    this.doctor = value[0]!

                    this.detailForm = this.fb.group({
                        id: value[0].id,
                        firstName: this.doctor?.name.first,
                        lastName: this.doctor?.name.last,
                        dob: this.doctor?.dob,
                        gender: this.doctor?.gender,
                        phone: this.doctor?.contact.phone,
                        email: this.doctor?.contact.email,
                        address: this.doctor?.contact.address,
                        specialization: this.doctor?.specialization,
                        qualification: this.doctor?.qualification
                    });
                })
            } else {
                this.navigated = false;
                this.doctor = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    _id: "",
                    specialization: "",
                    qualification: ""
                }
            }
        }
        else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== undefined) {
                this.navigated = true;
                (await this.apiService.getOne("doctors", id!)).subscribe((doctor: Doctor) => (this.doctor = doctor));
            } else {
                this.navigated = false;
                this.doctor = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    _id: "",
                    specialization: "",
                    qualification: ""
                }
            }
        }
    }




}
