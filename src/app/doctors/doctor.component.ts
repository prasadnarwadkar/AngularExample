import { Component, inject, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Patient, ExpandedPatient, ExpandedDoctor, Doctor } from '../models/othermodels';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionRequest } from '../models/models';
import { AuthService } from '../shared/services';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-doctors',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorsComponent implements OnInit {
  currentScreenSize!: string;
  destroyed = new Subject<void>();

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);


  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "patients" }
  createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "patients" }
  updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "patients" }
  readPermissionRequest: PermissionRequest = { "action": "read", "pageName": "patients" }

  displayedColumns = ['firstName', 'lastName', 'phone', 'dob', 'address', 'email', 'specialization','qualification','action'];

  dataSource2 = new MatTableDataSource<ExpandedDoctor>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  data: Doctor[] = [];
  form: FormGroup;
  filtered: Doctor[] = [];
  searchTerm: string = '';
  selectedEntity: Doctor | undefined;

  constructor(private authService: AuthService, private apiService: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      dob: [''],
      gender: [''],
      phone: [''],
      email: [''],
      address: ['']
    });

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
                this.displayedColumns = ['firstName', 'lastName', 'phone'];
                break;
              case "Small":
                this.displayedColumns = ['firstName', 'lastName', 'phone', 'dob'];
                break;
              case "Medium":
                this.displayedColumns = ['firstName', 'lastName', 'phone', 'dob','address'];
                break;
              case "Large":
                this.displayedColumns = ['firstName', 'lastName', 'phone', 'dob', 'address', 'email','specialization','qualification', 'action'];
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

    this.setDataSource(this.data)


  }


  ngAfterViewInit() {
    this.setDataSource(this.filtered)


  }



  async loadData() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.data = await this.apiService.getAll('doctors');
      this.filtered = this.data;
    }
    else {
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions.")
    }

  }

  filterPatients() {
    this.filtered = this.data.filter(patient =>
      patient.name?.first.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.name?.last.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.contact?.phone.includes(this.searchTerm)
    );

    this.setDataSource(this.filtered)
  }

  setDataSource(list: Doctor[]) {
    const expandedList = list.map(p => ({
      firstName: p.name.first,
      lastName: p.name.last,
      phone: p.contact.phone,
      email: p.contact.email,
      address: p.contact.address,
      dob: p.dob,
      _id: p._id,
      id: p.id,
      gender: p.gender,
      specialization: p.specialization,
      qualification: p.qualification
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedDoctor>(expandedList);
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }


  async deletePatient(id: string, e: Event) {
    e.preventDefault();
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this patient?")) {
        await this.apiService.delete('patients', id);
      }
    }
    this.loadData();
  }
}