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
        rolename: ''
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
            rolename: ''
        });
    }

    onAllActionsListSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.actions = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)
        }
        
    }

    onRoleSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.rolename = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)[0]
        }
        
    }

    onPageSelectionChange(event: MatSelectionListChange) {
        if (this.roleActionMap) {
            this.roleActionMap.pageName = event.source.selectedOptions.selected.map(option => option._elementRef.nativeElement.innerText)[0]
        }
        
    }

    async create() {
        
        await this.authService.createRoleActionMap(this.roleActionMap!).then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                else {
                    this.router.navigate(['/roleactionmaps']);
                }
            }).catch(error => {
                console.error("An error occurred:", error);
                alert(error.response.data.message)
            });
    }

    async ngOnInit(): Promise<void> {
        this.roles = await this.authService.getAllRoles();
        this.pages = await this.authService.getAllPages();
    }

    async save(): Promise<any> {
 

        if (this.roleActionMapDetailNewForm.value.firstName.length > 0) {

            try {
                await this.apiService.create("roleactionmaps", this.roleActionMapDetailNewForm.value).then((res) => {
                    this.router.navigate(['/roleactionmaps']);
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
