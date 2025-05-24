import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { HeroService } from '../services/hero.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { Patient, RoleActionMap } from '../models/othermodels';
import { AuthService } from '../shared/services';
import { MatSelectionListChange } from '@angular/material/list';
import { Action } from '../shared/interfaces';
import { PermissionRequest } from '../models/models';


@Component({
    selector: 'patient-detail',
    templateUrl: './roleactionmap-detail.component.html',
    styleUrls: ['././roleactionmap.component.css']
})
export class RoleActionMapDetailComponent implements OnInit {
    roleActionMapDetailForm: FormGroup;
    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "roleactionmaps" }
    async update() {
        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.authService.updateRoleActionMap(this.roleActionMap!._id!,
                this.roleActionMap!).then((res) => {
                    this.router.navigate(['/roleactionmaps']);
                });
        }
        else{
            alert('You are not authorized to modify data');
        }
    }
    @Input() public roleActionMap: RoleActionMap | undefined;
    @Output() closeTheHeroSaveDlg = new EventEmitter<Hero>();

    navigated = false; // true if navigated here
    allActions: Action[] = [{
        action: 'read',
        selected: false
    },
    {
        action: 'delete',
        selected: false
    },
    {
        action: 'update',
        selected: false
    },
    {
        action: 'create',
        selected: false
    }]

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.roleActionMapDetailForm = this.fb.group({
            rolename: [''],
            pageName: [''],
            _id: [],
            actions: []
        });
    }

    onAllActionsListSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.actions = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)
        }

    }

    async ngOnInit(): Promise<void> {
        if (this.route.snapshot.params != undefined) {
            const role = this.route.snapshot.params['role'];
            const page = this.route.snapshot.params['page'];

            if (role !== undefined
                && page !== undefined) {
                this.navigated = true;
                this.roleActionMap = (await this.authService.getRoleActionsByRoleAndPage(role, page))[0];

                this.roleActionMapDetailForm = this.fb.group({
                    rolename: this.roleActionMap?.rolename!,
                    pageName: this.roleActionMap?.pageName,
                    _id: this.roleActionMap?._id,
                    actions: [this.roleActionMap?.actions]
                });
            } else {
                this.navigated = false;
                this.roleActionMap = {
                    _id: "",
                    rolename: "",
                    pageName: "",
                    actions: []
                }
            }
        }
        else {
            const role = this.route.snapshot.paramMap.get('role');
            const page = this.route.snapshot.paramMap.get('page');
            if (role !== undefined
                && page !== undefined) {
                this.navigated = true;
                this.roleActionMap = await this.authService.getRoleActionsByRoleAndPage(role!, page!);
                this.roleActionMapDetailForm = this.fb.group({
                    rolename: this.roleActionMap?.rolename,
                    pageName: this.roleActionMap?.pageName,
                    _id: this.roleActionMap?._id,
                    actions: this.roleActionMap?.actions
                });
            } else {
                this.navigated = false;
                this.roleActionMap = {
                    _id: "",
                    rolename: "",
                    pageName: "",
                    actions: []
                }
            }
        }

        this.allActions.forEach((value, index) => {
            value.selected = false

            let indexFound = this.roleActionMap?.actions?.findIndex(x => x == value.action)!

            if (indexFound > -1) {
                value.selected = true
            }
        })
    }

    async save(): Promise<any> {
        //todo
        if (this.roleActionMap && this.roleActionMap.rolename
            && this.roleActionMap.pageName.length > 0) {

            try {
                //todo
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
