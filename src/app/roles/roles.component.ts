import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpandedRole, Role } from '../models/othermodels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest, RoleAndDesc } from '../models/models';
import { AuthService } from '../shared/services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./role.component.css']
})
export class RolesComponent implements OnInit {
  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "roles" }

  displayedColumns = ['role', 'desc'];

  dataSource2 = new MatTableDataSource<ExpandedRole>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  roles: RoleAndDesc[] = [];

  filteredRoles: RoleAndDesc[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadRoles();

    
    console.log(this.roles)

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

  setDataSource(list: RoleAndDesc[]) {
    const expandedList = list.map(p => ({
      role: p.role,
      _id: p._id,
      desc: p.desc
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedRole>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async deleteRole(id: string, e: Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this role?")) {
        await this.authService.deleteRole(id);
      }
    }
    this.loadRoles();
  }
}