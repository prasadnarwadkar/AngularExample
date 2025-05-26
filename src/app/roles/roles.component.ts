import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExpandedRole, Role } from '../models/othermodels';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { AuthService } from '../shared/services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./role.component.css']
})
export class RolesComponent implements OnInit {
  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "roles" }

  displayedColumns = ['role'];

  dataSource2 = new MatTableDataSource<ExpandedRole>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  roles: Role[] = [];

  filteredRoles: Role[] = [];
  searchTerm: string = '';
 
  constructor(private authService: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadRoles();

    this.setDataSource(this.roles)
  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredRoles)
  }



  async loadRoles() {
    this.roles = await this.authService.getAllRoles();
    
    this.filteredRoles = this.roles;

  }

  filterRoles() {
    this.filteredRoles = this.roles.filter(role =>
      role.role?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.setDataSource(this.filteredRoles)
  }

  setDataSource(list: Role[]) {
    const expandedList = list.map(p => ({
      role: p.role,
      _id: p._id
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedRole>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async deleteRole(id: string, e:Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this role?")) {
        await this.authService.deleteRole(id);
      }
    }
    this.loadRoles();
  }
}