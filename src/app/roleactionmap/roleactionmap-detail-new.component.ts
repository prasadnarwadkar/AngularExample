import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { Action, Page, Role, RoleActionMap, RoleActionMapNew } from '../models/othermodels';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
    selector: 'roleactionmap-detail-new',
    templateUrl: './roleactionmap-detail-new.component.html',
    styleUrls: ['././roleactionmap.component.css']
})
export class RoleActionMapNewComponent implements OnInit {
    roleActionMapDetailNewForm: FormGroup;
    roleActionMap: RoleActionMapNew = {
        actions: [],
        pageName: '',
        role: ''
    };

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
    roles: Role[] = [];
    pages: Page[] = [];

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.roleActionMapDetailNewForm = this.fb.group({
            _id: '',
            actions: [],
            pageName: '',
            role: ''
        });
    }

    onAllActionsListSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.actions = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)
        }

    }

    onRoleSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.role = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)[0]
        }

    }

    onPageSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.pageName = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)[0]
        }

    }

    mapRole(x:any) {
        let newMap = x;

        newMap.rolename = x.role;
        delete newMap.role;
        return newMap;
    }

    unmapRole(x:any) {
        let newMap = x;

        newMap.role = x.rolename;
        delete newMap.rolename;
        return newMap;
    }


    async create() {
        this.roleActionMap = this.mapRole(this.roleActionMap)
        console.log(this.roleActionMap)
        
        await this.authService.createRoleActionMap(this.roleActionMap!).then((res) => {
            if (!res.ok) {
                this.roleActionMap = this.unmapRole(this.roleActionMap)
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            else {
                this.router.navigate(['/roleactionmaps']);
            }
        }).catch(error => {
            this.roleActionMap = this.unmapRole(this.roleActionMap)
            console.error("An error occurred:", error);
            alert(error.response.data.message)
        });
    }

    async ngOnInit(): Promise<void> {
        this.roles = await this.authService.getAllRoles();
        this.pages = await this.authService.getAllPages();
    }
}
