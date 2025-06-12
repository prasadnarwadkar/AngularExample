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

  displayedColumns = [ 'fullname','email', 'roles',  'action2','action3'];

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
    
  }



  async loadUsers() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.users = await this.authService.getAllUsers();

      this.authService.getUser().subscribe(x=> {
        console.log(x)
        this.users.splice(this.users.findIndex(u=> u.email.toLowerCase() == x?.email.toLocaleLowerCase()),1)
        // No admin user should be updated.
        let adminUsers = this.users.filter(u=> u.roles?.includes('admin'))

        adminUsers.forEach((value, index)=>{
          this.users.splice(this.users.findIndex(u=> u == value), 1)
        });
      });
      console.log(this.users)

      this.filteredUsers = this.users;
    }
    else{
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions.")
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
      fullname: p.name?.first! + " " + p.name?.last!,
      email: p.email,
      roles: p.roles?.join(','),
      _id: p._id,
      enabled: p.enabled
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
    await this.loadUsers();

    this.setDataSource(this.users)
  }

  async disableUser(id: string, e: Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to disable this user?")) {
        await this.authService.disableUser(id);
      }
    }
    await this.loadUsers();

    this.setDataSource(this.users)
  }

  async enableUser(id: string, e: Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to enable this user?")) {
        await this.authService.enableUser(id);
      }
    }
    await this.loadUsers();

    this.setDataSource(this.users)
  }
}