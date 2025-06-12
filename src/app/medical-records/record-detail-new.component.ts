import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { PermissionRequest } from '../models/models';
import { DisplayAppointment, Patient } from '../models/othermodels';
import { DataService } from '../services/Dataservice';

@Component({
    selector: 'record-detail-new',
    templateUrl: './record-detail-new.component.html',
    styleUrls: ['././record.component.css']
})
export class RecordDetailNewComponent implements OnInit {
    detailNewForm: FormGroup;
    createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "records" }
    selectedPatientId!: string;
    patients!: Patient[];
    appointments!: DisplayAppointment[];
    selectedApptId!: string;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private fb: FormBuilder,
        private ds: DataService
    ) {
        this.detailNewForm = this.fb.group({
            patient_id: [''],
            doctor_id: [''],
            origin: [''],
            blood_pressure_systolic: [''],
            blood_pressure_diastolic: [''],
            pulse_oximetry_spo2: [''],
            blood_group: [''],
            blood_antigen: [''],
            pulse_rate: [''],
            body_temperature: [''],
            body_height: [''],
            body_weight: [''],
        });
    }

    async onPatientListSelectionChange(event: Event) {
        console.log("selected patient: ", (event.target as HTMLSelectElement).selectedIndex)
        this.selectedPatientId = (event.target as HTMLSelectElement).value;
        console.log(this.selectedPatientId)
        this.appointments = (await this.ds.getEventsByPatientId(this.selectedPatientId)).map((a: any) => ({
            date: new Date(a.start).toDateString(),
            patient_id: a.patient_id,
            doctor_id: a.doctor_id,
            text: a.text,
            id: a.id
        }));
    }

    async onApptListSelectionChange(event: Event) {
        console.log("selected appointment: ", (event.target as HTMLSelectElement).selectedIndex)
        this.selectedApptId = (event.target as HTMLSelectElement).value;
        console.log(this.selectedApptId)
    }

    async ngOnInit(): Promise<void> {
        this.patients = (await this.apiService.getAll('patients'));
        this.appointments = (await this.ds.getEventsByPatientId(this.patients.length > 0 ? this.patients[0].id : "")).map((a: any) => ({
            date: new Date(a.start).toDateString(),
            patient_id: a.patient_id,
            doctor_id: a.doctor_id,
            text: a.text,
            id: a.id
        }));

        this.selectedPatientId = this.patients[0].id
        this.selectedApptId = this.appointments[0].id
    }

    async save(): Promise<any> {
        if (await this.authService.hasPermission(this.createPermissionRequest.action, this.createPermissionRequest.pageName)) {


            if (this.selectedPatientId?.length > 0) {

                this.detailNewForm.value.patient_id = this.selectedPatientId
                this.detailNewForm.value.appointment_id = this.selectedApptId
                this.detailNewForm.value.origin = new Date()
                let apptById = (await this.ds.getEventById(this.selectedApptId))

                if (apptById) {
                    this.detailNewForm.value.doctor_id = apptById.doctor_id
                }

                this.detailNewForm.value.attributes = {};
                this.detailNewForm.value.attributes.blood_pressure_systolic = this.detailNewForm.value.blood_pressure_systolic
                this.detailNewForm.value.attributes.blood_pressure_diastolic = this.detailNewForm.value.blood_pressure_diastolic
                this.detailNewForm.value.attributes.blood_group = this.detailNewForm.value.blood_group
                this.detailNewForm.value.attributes.blood_antigen = this.detailNewForm.value.blood_antigen
                this.detailNewForm.value.attributes.pulse_oximetry_spo2 = this.detailNewForm.value.pulse_oximetry_spo2
                this.detailNewForm.value.attributes.pulse_rate = this.detailNewForm.value.pulse_rate
                this.detailNewForm.value.attributes.body_height = this.detailNewForm.value.body_height
                this.detailNewForm.value.attributes.body_weight = this.detailNewForm.value.body_weight
                this.detailNewForm.value.attributes.body_temperature = this.detailNewForm.value.body_temperature

                delete this.detailNewForm.value.blood_pressure_systolic
                delete this.detailNewForm.value.blood_pressure_diastolic
                delete this.detailNewForm.value.blood_group
                delete this.detailNewForm.value.blood_antigen
                delete this.detailNewForm.value.pulse_oximetry_spo2
                delete this.detailNewForm.value.pulse_rate
                delete this.detailNewForm.value.body_height
                delete this.detailNewForm.value.body_weight
                delete this.detailNewForm.value.body_temperature

                try {
                    await this.apiService.create("records", this.detailNewForm.value).then((res) => {
                        alert('Medical record has been successfully created for the given patient against the given appointment.');
                        this.router.navigate(['/records']);
                    });
                }
                catch (error) {
                    alert(error)
                }
            }
            else {
                alert('Please select a patient to record vitals for.');

            }
        }
        else {
            alert('You are not authorized to register a new medical record. Please contact system administrator so they can give you permissions.');
        }
    }
}
