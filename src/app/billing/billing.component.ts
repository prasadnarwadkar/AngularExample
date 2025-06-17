import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormBuilder } from '@angular/forms';
import { Bill, ExpandedBill } from '../models/othermodels';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { AuthService } from '../shared/services';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/Dataservice';
import { Router } from '@angular/router';


@Component({
  selector: 'app-records',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  currentScreenSize!: string;
  destroyed = new Subject<void>();

  convertDateToLocale(arg0: Date) {
    return new Date(arg0).toLocaleString()
  }

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);


  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "bills" }
  createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "bills" }
  updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "bills" }
  readPermissionRequest: PermissionRequest = { "action": "read", "pageName": "bills" }

  displayedColumns = ['patient_name', 'total', 'status', 'doctor_name', 'appointment_reason', 'appointment_date', 'action'];

  dataSource2 = new MatTableDataSource<ExpandedBill>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  data: Bill[] = [];

  filtered: Bill[] = [];
  searchTerm: string = '';
  selectedEntity: ExpandedBill | undefined;



  constructor(private ds: DataService, private authService: AuthService, private apiService: ApiService, private fb: FormBuilder, private router: Router,) {

    var token = this.authService.getJwt()

    if (!token) {
      //window.location.reload()
    }



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
                this.displayedColumns = ['patient_name', 'total', 'status'];
                break;
              case "Small":
                this.displayedColumns = ['patient_name', 'total', 'status', 'doctor_name', 'action'];
                break;
              case "Medium":
                this.displayedColumns = ['patient_name', 'total', 'status', 'doctor_name', 'appointment_reason', 'appointment_date', 'action'];
                break;
              case "Large":
                this.displayedColumns = ['patient_name', 'total', 'status', 'doctor_name', 'appointment_reason', 'appointment_date', 'action'];
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

    


  }


  ngAfterViewInit() {
    this.setDataSource(this.filtered)


  }



  async loadData() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.data = await this.apiService.getAll('bills');
      console.log("bills: ", this.data)
      this.filtered = this.data;
      this.setDataSource(this.filtered)
    }
    else {
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions.")
    }

  }

  async filterPatients() {
    this.filtered = this.data.filter(record =>
      record.status?.toString().includes(this.searchTerm) ||
      record.origin?.toString().includes(this.searchTerm) ||
      record.items && record.items.length > 0 &&  record.items.map(x=> x.amount).includes(Number.parseFloat(this.searchTerm)) ||
      record.items && record.items.length > 0 &&  record.items.map(x=> x.description?.toLowerCase()).includes(this.searchTerm.toLowerCase())
    );

    await this.setDataSource(this.filtered)
  }

  async setDataSource(list: Bill[]) {
    this.dataSource2 = new MatTableDataSource<ExpandedBill>(await this.mapFromRecordsToGridListDS(list));
    console.log("this.dataSource2", this.dataSource2)
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }

  async mapFromRecordsToGridListDS(list: Bill[]): Promise<ExpandedBill[]> {
    return Promise.all(list.map(async p => {
      const patient = (await this.apiService.getOne("patients", p.patient_id))[0];
      const doctor = (await this.apiService.getOne("doctors", p.doctor_id))[0];
      const appointment = (await this.apiService.getOne("appointments", p.appointment_id))[0];
      console.log(doctor?.name?.first! + " " + doctor?.name?.last!)
      return {
        patient_name: patient?.name?.first + " " + patient?.name?.last?.toString()[0],
        patient_id: p.patient_id,
        doctor_name: doctor?.name?.first + " " + doctor?.name?.last,
        doctor_id: p.doctor_id,
        appointment_id: p.appointment_id,
        appointment_reason: appointment.text,
        appointment_date: appointment.start,
        origin: p.origin,
        status: p.status,
        total: p.total,
        id: p.id
      };
    }));
  }


  async delete(id: string, e: Event) {
    e.preventDefault();
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this medical record?")) {
        await this.apiService.delete('bills', id);
        await this.loadData();
      }
    }
    
  }
}
