import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuditLog, AuditLogRequest, PermissionRequest, RoleAndDesc } from '../models/models';
import { AuthService } from '../shared/services';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.css']
})
export class AuditLogsComponent implements OnInit {
  readPermissionRequest: PermissionRequest = { "action": "read", "pageName": "auditlogs" }

  currentScreenSize!: string;
  destroyed = new Subject<void>();

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  displayedColumns = ['email', 'entity', 'createdAt', 'pageName', 'action', 'field', 'oldvalue', 'newvalue'];

  dataSource2 = new MatTableDataSource<AuditLog>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  auditLogs: AuditLogRequest[] = [];

  filteredAuditLogs: AuditLogRequest[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) {
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

            switch (this.currentScreenSize) {
              case "XSmall":
                this.displayedColumns = ['entity', 'field', 'oldvalue', 'newvalue'];
                break;
              case "Small":
                this.displayedColumns = ['entity', 'field', 'oldvalue', 'newvalue', 'createdAt'];
                break;
              case "Medium":
                this.displayedColumns = ['entity', 'field', 'oldvalue', 'newvalue', 'createdAt', 'pageName'];
                break;
              case "Large":
                this.displayedColumns = ['email', 'entity', 'createdAt', 'pageName', 'action', 'field', 'oldvalue', 'newvalue', 'entity_id'];
                break;
              default:
                break;
            }


          }
        }
      });
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();


    console.log(this.auditLogs)

    this.setDataSource(this.auditLogs)
  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredAuditLogs)
  }



  async loadData() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.auditLogs = await this.authService.getAllAuditLogs();

      this.filteredAuditLogs = this.auditLogs;
    }
    else {
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions.")
    }

  }

  filterData() {
    this.filteredAuditLogs = this.auditLogs.filter(x =>
      x.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.action?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.entity?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.pageName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.valueChanged?.field?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.valueChanged?.newvalue?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      || x.valueChanged?.oldvalue?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      || new Date(x.createdAt).toLocaleString()?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.setDataSource(this.filteredAuditLogs)
  }

  returnEntityLink(element: any) {
    switch (element.entity) {
      case "doctor":
        return `/doctor-detail/${element.entity_id}`
      case "patient":
        return `/patient-detail/${element.entity_id}`
      case "medical_record":
        return `/record-detail/${element.entity_id}`
      default:
        return "/"
    }
  }

  setDataSource(list: AuditLogRequest[]) {
    const expandedList = list.map(p => ({
      action: p.action,
      field: p.valueChanged.field,
      newvalue: p.valueChanged.newvalue,
      oldvalue: p.valueChanged.oldvalue,
      entity: p.entity,
      email: p.email,
      pageName: p.pageName,
      createdAt: p.createdAt,
      createdAtDate: new Date(p.createdAt).toLocaleString(),
      entity_id: p.entity_id
    }));

    this.dataSource2 = new MatTableDataSource<AuditLog>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }
}