import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormBuilder } from '@angular/forms';
import { RoleActionMap } from '../models/othermodels';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { AuthService } from '../shared/services';

@Component({
  selector: 'app-roleactionmaps',
  templateUrl: './roleactionmap.component.html',
  styleUrls: ['./roleactionmap.component.css']
})
export class RoleActionMapComponent implements OnInit {
  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "roleactionmaps" }
  createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "roleactionmaps" }
  updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "roleactionmaps" }

  displayedColumns = ['role', 'pageName', 'actions','action'];

  dataSource2 = new MatTableDataSource<RoleActionMap>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  data: RoleActionMap[] = [];
  
  filteredRoleActionMaps: RoleActionMap[] = [];
  searchTerm: string = '';
  

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService, private fb: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();

    this.setDataSource(this.data)
  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredRoleActionMaps)
  }



  async loadData() {
    this.data = await this.authService.getAllRoleActionmaps();

    this.authService.getUser().subscribe(x=> {
        console.log(x)
        let thisUserRoleMatches = this.data.filter(u=> x?.roles.includes(u.role));
        thisUserRoleMatches.forEach((value, index) => {
          if (x?.roles.includes(value.role))
          {
            this.data.splice(this.data.findIndex(y=> y.role == value.role), 1)
          }
        });
      });
    
    this.filteredRoleActionMaps = this.data;

  }

  filterData() {
    this.filteredRoleActionMaps = this.data.filter(roleactionmap =>
      roleactionmap.role?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      roleactionmap.pageName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      roleactionmap.actions?.includes(this.searchTerm)
    );

    this.setDataSource(this.filteredRoleActionMaps)
  }

  setDataSource(list: RoleActionMap[]) {
    const expandedList = list.map(p => ({
      pageName: p.pageName,
      role: p.role,
      actions: p.actions,
      _id: p._id
    }));

    this.dataSource2 = new MatTableDataSource<RoleActionMap>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async delete(id: string, e: Event) {
    e.preventDefault();
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this role action map?")) {
        //todo
      }
    }
    this.loadData();
  }
}