import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Patient, ExpandedPatient } from '../models/patient';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-patients',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientsComponent implements OnInit {
  ELEMENT_DATA: Element[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
    { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
    { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
    { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
    { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
    { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
    { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
    { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
    { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
    { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
  ];
  displayedColumns = ['firstName', 'lastName', 'phone', 'email', 'dob', 'address', 'action'];

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

  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      dob: [''],
      gender: [''],
      phone: [''],
      email: [''],
      address: ['']
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
    this.patients = await this.apiService.getAll('patients');

    this.filteredPatients = this.patients;

    console.log(this.filteredPatients);
  }

  async addPatient() {
    await this.apiService.create('patients', this.patientForm.value);
    this.loadPatients();
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


  async deletePatient(id: string) {
    if (confirm("Would you like to delete this patient?")){
      await this.apiService.delete('patients', id);
    }
    this.loadPatients();
  }

  gotoDetail(): void {
    this.router.navigate(['/patient-detail', this.selectedPatient?.id]);
  }
}