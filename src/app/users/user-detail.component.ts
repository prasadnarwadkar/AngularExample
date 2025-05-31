import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { MatSelectionListChange } from '@angular/material/list';
import { Role } from '../models/othermodels';
import { User } from '../shared/interfaces';


@Component({
    selector: 'user-detail',
    templateUrl: '././user-detail.component.html',
    styleUrls: ['././user.component.css']
})
export class UserDetailComponent implements OnInit {
    userDetailForm: FormGroup;
    allRoles: Role[] = [];
    isEmailDisabled: boolean = true;
    async updateUser() {
        if (this.userDetailForm.value.fullname.length < 1) {
            alert("Fullname must not be blank")
            return
        }

        if (this.userDetailForm.value.fullname.length > 0) {

            if (this.user) {
                this.user.fullname = this.userDetailForm.value.fullname
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
        else {
            alert('Name can\'t be blank');

        }
    }
    @Input() public user: User | undefined;

    error: any;
    navigated = false; // true if navigated here

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.userDetailForm = this.fb.group({
            fullname: [''],
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


    async ngOnInit(): Promise<void> {
        this.allRoles = await this.authService.getAllRoles();


        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];

            if (id !== undefined) {
                this.navigated = true;

                this.user = (await this.authService.getUserById(id))[0];

                this.userDetailForm = this.fb.group({
                    id: this.user?._id,
                    email: this.user?.email,
                    fullname: this.user?.fullname,
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
                    token:"",
                    enabled:false
                }
            }
        }
        else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== undefined) {
                this.user = await this.authService.getUserById(id!);

                this.userDetailForm = this.fb.group({
                    id: this.user?._id,
                    email: this.user?.email,
                    fullname: this.user?.fullname,
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
                    token:"",
                    enabled:false
                }
            }
        }

        this.allRoles.forEach((value, index) => {
            value.selectedForUser = false

            let indexFound = this.user?.roles?.findIndex(x => x == value.role)!

            if (indexFound > -1){
                value.selectedForUser = true
            }
        })
    }

    async save(): Promise<any> {
        if (this.user && this.user.fullname && this.user.fullname.length > 0) {

            try {
                await this.authService.updateUser(this.user._id, this.user).then((res) => {
                    this.router.navigate(['/users']);
                });
            }
            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Name can\'t be blank');

        }
    }

    goBack(savedHero: Hero | undefined): void {
        if (!savedHero) {
            this.route.url.subscribe((val) => {
                if (val.length > 0) {
                    if (val[0].path == "detail") {
                        this.router.navigate(['/heroes']);
                    }
                }
            },
                (error) => {
                });
        }
        else {
            this.router.navigate(['/users']);
        }
    }
}
