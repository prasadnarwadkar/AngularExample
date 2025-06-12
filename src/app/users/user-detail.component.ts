import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';
import { MatSelectionListChange } from '@angular/material/list';
import { Doctor, Role } from '../models/othermodels';
import { User } from '../shared/interfaces';
import { ApiService } from '../services/hospital.service';
import { EmailAndDoctorIdRequest } from '../models/models';


@Component({
    selector: 'user-detail',
    templateUrl: '././user-detail.component.html',
    styleUrls: ['././user.component.css']
})
export class UserDetailComponent implements OnInit {
    userDetailForm: FormGroup;
    allRoles: Role[] = [];
    isEmailDisabled: boolean = true;
    doctors: Doctor[] | undefined;
    selectedDoctorId: string | undefined;
    originalRoles: string[] | undefined;

    @ViewChild('doctorSelectElement') selectElement!: ElementRef;

    async assignDoctorRole() {
        if (this?.selectedDoctorId!.length < 1) {
            this.selectedDoctorId = this.selectElement.nativeElement.value

            if (this.selectedDoctorId!.length < 1) {
                alert("Please select a doctor")
                return
            }

            try {
                let emailAndDoctorId: EmailAndDoctorIdRequest = {
                    email: this.user?.email!,
                    doctor_id: this.selectedDoctorId!
                }
                await this.authService.assignDocRoleToUser(emailAndDoctorId).then((res) => {
                    alert("Reset Password email has been sent to the user's email address. Doctor's role has been assigned to the user. Due to change of role, they will need to reset their password.")
                });
            }

            catch (error) {
                alert(error)
            }
        }
        else {
            try {
                let emailAndDoctorId: EmailAndDoctorIdRequest = {
                    email: this.user?.email!,
                    doctor_id: this.selectedDoctorId!
                }
                await this.authService.assignDocRoleToUser(emailAndDoctorId).then((res) => {
                    alert("Reset Password email has been sent to the user's email address. Doctor's role has been assigned to the user. Due to change of role, they will need to reset their password.")
                });
            }

            catch (error) {
                alert(error)
            }
        }
    }

    async updateUser() {
        if (this.userDetailForm.value.first.length < 1
            || this.userDetailForm.value.last.length < 1
        ) {
            alert("First and Last names must not be blank")
            return
        }

        if (this.user) {
            if (!this.user.name) {
                this.user.name = {
                    first: this.userDetailForm.value.first,
                    last: this.userDetailForm.value.last
                }
            }
            else
            {
                this.user.name.first = this.userDetailForm.value.first;
                this.user.name.last = this.userDetailForm.value.last;
            }
        }

        if (this.user) {
            try {
                await this.authService.updateUser(this.user?._id!, this.user!).then((res) => {
                    this.router.navigate(['/users']);
                });
            }

            catch (error) {
                alert(error)
            }
        }
    }
    @Input() public user: User | undefined;

    error: any;
    navigated = false; // true if navigated here

    constructor(
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private apiService: ApiService
    ) {
        this.userDetailForm = this.fb.group({
            first: [''],
            last: [''],
            email: [''],
            id: []
        });
    }

    onAllRolesListSelectionChange(event: MatSelectionListChange) {
        if (this.user) {
            this.user.roles = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)
        }
    }

    onUserRolesListSelectionChange(event: MatSelectionListChange) {

    }

    onDocListSelectionChange(event: Event) {
        console.log("selected doctor: ", (event.target as HTMLSelectElement).selectedIndex)
        this.selectedDoctorId = (event.target as HTMLSelectElement).value;
        console.log(this.selectedDoctorId)
    }

    async ngAfterViewInit(): Promise<void> {
        (this.selectElement.nativeElement as HTMLSelectElement).selectedIndex = 0
        this.selectedDoctorId = this.selectElement.nativeElement.selectedIndex
        console.log("selected doctor id ", this.selectedDoctorId)
        console.log((this.selectElement.nativeElement as HTMLSelectElement).selectedIndex)
    }

    async ngOnInit(): Promise<void> {
        this.allRoles = await this.authService.getAllRoles();

        this.doctors = await this.apiService.getAll("doctors")
        console.log(JSON.stringify(this.doctors))

        console.log()
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];

            if (id !== undefined) {
                this.navigated = true;

                this.user = (await this.authService.getUserById(id))[0];
                this.originalRoles = this.user?.roles

                this.userDetailForm = this.fb.group({
                    id: this.user?._id,
                    email: this.user?.email,
                    first: this.user?.name?.first,
                    last: this.user?.name?.last,
                });
            } else {
                this.navigated = false;
                this.user = {
                    _id: "",
                    email: "",
                    roles: [],
                    fullname: "",
                    createdAt: "",
                    isAdmin: false,
                    picture: "",
                    token: "",
                    enabled: false,
                    picData: new ArrayBuffer(0),
                    doctor_id: "",
                    name: { first: "", last: "" }
                }
            }
        }
        else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== undefined) {
                this.user = (await this.authService.getUserById(id!))[0];

                this.originalRoles = this.user?.roles

                this.userDetailForm = this.fb.group({
                    id: this.user?._id,
                    email: this.user?.email,
                    first: this.user?.name.first,
                    last: this.user?.name.last,
                });
            } else {
                this.navigated = false;
                this.user = {
                    _id: "",
                    email: "",
                    roles: [],
                    fullname: "",
                    createdAt: "",
                    isAdmin: false,
                    picture: "",
                    token: "",
                    enabled: false,
                    picData: new ArrayBuffer(0),
                    doctor_id: "",
                    name: { first: "", last: "" }
                }
            }
        }

        this.allRoles.forEach((value, index) => {
            value.selectedForUser = false

            let indexFound = this.user?.roles?.findIndex(x => x == value.role)!

            if (indexFound > -1) {
                value.selectedForUser = true
            }
        })

        this.selectedDoctorId = ((this.selectElement.nativeElement as HTMLSelectElement).value)
    }
}
