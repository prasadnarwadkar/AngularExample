import { Component, inject, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Patient, ExpandedPatient } from '../models/othermodels';
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
  selector: 'app-patients',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientsComponent implements OnInit {
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

  displayedColumns = ['firstName', 'lastName', 'phone', 'dob', 'address', 'email', 'action'];

  dataSource2 = new MatTableDataSource<ExpandedPatient>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  patients: Patient[] = [];
  patientForm: FormGroup;
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  selectedPatient: Patient | undefined;

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService, private fb: FormBuilder) {
    this.patientForm = this.fb.group({
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
                this.displayedColumns = ['firstName', 'lastName', 'phone', 'dob', 'address', 'email', 'action'];
                break;
              default:
                break;
            }


          }
        }
      });
  }

  async ngOnInit(): Promise<void> {
    await this.loadPatients();

    this.setDataSource(this.patients)


  }


  ngAfterViewInit() {
    this.setDataSource(this.filteredPatients)


  }



  async loadPatients() {
    if (await this.authService.hasPermission(this.readPermissionRequest.action, this.readPermissionRequest.pageName)) {
      this.patients = await this.apiService.getAll('patients');
      this.filteredPatients = this.patients;
    }
    else {
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions. If you have just registered and this is your first login, please sign out and back in.")
    }

  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient =>
      patient.name?.first.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.name?.last.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.contact?.phone.includes(this.searchTerm)
    );

    this.setDataSource(this.filteredPatients)
  }

  setDataSource(list: Patient[]) {
    const expandedList = list.map(p => ({
      firstName: p.name.first,
      lastName: p.name.last,
      phone: p.contact.phone,
      email: p.contact.email,
      address: p.contact.address,
      dob: p.dob,
      _id: p._id,
      id: p.id,
      gender: p.gender
    }));

    this.dataSource2 = new MatTableDataSource<ExpandedPatient>(expandedList);
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
    this.loadPatients();
  }
}