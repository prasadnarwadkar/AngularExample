import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpandedUser } from '../models/othermodels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services';




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./user.component.css']
})
export class UsersComponent implements OnInit {
  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "users" }
  createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "users" }
  updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "users" }
  readPermissionRequest: PermissionRequest = { "action": "read", "pageName": "users" }

  displayedColumns = ['email', 'fullname', 'roles', 'action'];

  dataSource2 = new MatTableDataSource<ExpandedUser>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  users: User[] = [];

  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadUsers();

    this.setDataSource(this.users)
  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredUsers)
  }



  async loadUsers() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.users = await this.authService.getAllUsers();

      this.filteredUsers = this.users;
    }
    else{
      alert("You are not authorized to view data on this page.")
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.setDataSource(this.filteredUsers)
  }

  setDataSource(list: User[]) {
    const expandedList = list.map(p => ({
      fullname: p.fullname,
      email: p.email,
      roles: p.roles.join(','),
      _id: p._id
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedUser>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async deleteUser(id: string, e: Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this user?")) {
        await this.authService.deleteUser(id);
      }
    }
    this.loadUsers();
  }
}