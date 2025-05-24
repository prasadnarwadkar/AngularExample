import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient, ExpandedPage } from '../models/othermodels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { Page } from '../shared/interfaces';
import { AuthService } from '../shared/services';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./page.component.css']
})
export class PagesComponent implements OnInit {
  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "pages" }

  displayedColumns = ['page'];

  dataSource2 = new MatTableDataSource<ExpandedPage>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  pages: Page[] = [];

  filteredPages: Page[] = [];
  searchTerm: string = '';
  selectedPatient: Patient | undefined;

  constructor(private authService: AuthService) {

  }

  async ngOnInit(): Promise<void> {
    await this.loadUsers();

    this.setDataSource(this.pages)
  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredPages)
  }



  async loadUsers() {
    this.pages = await this.authService.getAllPages();
    
    this.filteredPages = this.pages;

  }

  filterPages() {
    this.filteredPages = this.pages.filter(page =>
      page.page?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.setDataSource(this.filteredPages)
  }

  setDataSource(list: Page[]) {
    const expandedList = list.map(p => ({
      page: p.page,
      _id: p._id
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedPage>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async deleteUser(id: string, e:Event) {
    e.preventDefault()
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this user?")) {
        await this.authService.deleteUser(id);
      }
    }
    this.loadUsers();
  }
}