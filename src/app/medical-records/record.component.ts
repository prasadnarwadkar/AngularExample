import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/hospital.service';
import { FormBuilder } from '@angular/forms';
import { Record, ExpandedRecord } from '../models/othermodels';
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
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
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


  deletePermissionRequest: PermissionRequest = { "action": "delete", "pageName": "records" }
  createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "records" }
  updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "records" }
  readPermissionRequest: PermissionRequest = { "action": "read", "pageName": "records" }

  displayedColumns = ['origin', 'patient_name', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'body_temperature', 'pulse_rate', 'pulse_oximetry_spo2', 'body_weight', 'body_height', 'blood_group', 'blood_antigen', 'action'];

  dataSource2 = new MatTableDataSource<ExpandedRecord>([]);

  @ViewChild(MatSort, { static: false })
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  data: Record[] = [];

  filtered: Record[] = [];
  searchTerm: string = '';
  selectedEntity: ExpandedRecord | undefined;



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
                this.displayedColumns = ['patient_name', 'blood_pressure_systolic', 'blood_pressure_diastolic'];
                break;
              case "Small":
                this.displayedColumns = ['patient_name', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'body_temperature', 'action'];
                break;
              case "Medium":
                this.displayedColumns = ['patient_name', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'body_temperature', 'body_weight', 'body_height', 'action'];
                break;
              case "Large":
                this.displayedColumns = ['origin', 'patient_name', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'body_temperature', 'pulse_rate', 'pulse_oximetry_spo2', 'body_weight', 'body_height', 'blood_group', 'blood_antigen', 'action'];
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
      this.data = await this.apiService.getAll('records');
      console.log("records: ", this.data)
      this.filtered = this.data;
      this.setDataSource(this.filtered)
    }
    else {
      alert("You are not authorized to view data on this page. Please contact system administrator so they can give you permissions.")
    }

  }

  async filterPatients() {
    this.filtered = this.data.filter(record =>
      record.attributes.blood_antigen.includes(this.searchTerm) ||
      record.attributes.blood_pressure_systolic.toString().includes(this.searchTerm) ||
      record.attributes.blood_pressure_diastolic.toString().includes(this.searchTerm) ||
      record.attributes.blood_group.includes(this.searchTerm) ||
      record.attributes.body_height.toString().includes(this.searchTerm) ||
      record.attributes.body_weight.toString().includes(this.searchTerm) ||
      record.attributes.body_temperature.toString().includes(this.searchTerm) ||
      record.attributes.pulse_oximetry_spo2.toString().includes(this.searchTerm) ||
      record.attributes.pulse_rate.toString().includes(this.searchTerm) ||
      record.attributes.body_mass_index.toString().includes(this.searchTerm) ||
      record.attributes.patient_name.toLowerCase().includes(this.searchTerm) ||
      record.attributes.doctor_name.toLowerCase().includes(this.searchTerm)
    );

    this.setDataSource(this.filtered)
  }

  async setDataSource(list: Record[]) {
    this.dataSource2 = new MatTableDataSource<ExpandedRecord>(await this.mapFromRecordsToGridListDS(list));
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort;
  }

  async mapFromRecordsToGridListDS(list: Record[]): Promise<ExpandedRecord[]> {
    return Promise.all(list.map(async p => {
      const patient = (await this.apiService.getOne("patients", p.patient_id))[0];
      const doctor = (await this.apiService.getOne("doctors", p.doctor_id))[0];
      const appointment = (await this.apiService.getOne("appointments", p.appointment_id))[0];
      return {
        patient_name: patient.name?.first + " " + patient.name?.last?.toString()[0],
        patient_id: p.patient_id,
        doctor_name: doctor.first + " " + doctor.last,
        doctor_id: p.doctor_id,
        appointment_id: p.appointment_id,
        appointment_reason: appointment.text,
        appointment_date: appointment.start,
        origin: new Date(p.origin).toLocaleString(),
        blood_pressure_systolic: p.attributes?.blood_pressure_systolic,
        blood_pressure_diastolic: p.attributes?.blood_pressure_diastolic,
        blood_antigen: p.attributes?.blood_antigen,
        blood_group: p.attributes?.blood_group,
        body_height: p.attributes?.body_height,
        body_weight: p.attributes?.body_weight,
        pulse_oximetry_spo2: p.attributes?.pulse_oximetry_spo2,
        pulse_rate: p.attributes?.pulse_rate,
        body_temperature: p.attributes?.body_temperature,
        body_mass_index: p.attributes?.body_mass_index,
        id: p.id
      };
    }));
  }


  async delete(id: string, e: Event) {
    e.preventDefault();
    if (await this.authService.hasPermission(this.deletePermissionRequest.action, this.deletePermissionRequest.pageName)) {
      if (confirm("Would you like to delete this medical record?")) {
        await this.apiService.delete('records', id);
        await this.loadData();
      }
    }
    
  }
}
