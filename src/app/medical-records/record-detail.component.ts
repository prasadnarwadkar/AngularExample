import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { DisplayAppointment, Doctor, Patient, User, Record } from '../models/othermodels';
import { PermissionRequest, AuditLogRequest, FieldOldValueNewValue } from '../models/models';
import { AuthService } from '../shared/services';
import { DataService } from '../services/Dataservice';


@Component({
    selector: 'record-detail',
    templateUrl: './record-detail.component.html',
    styleUrls: ['././record.component.css']
})
export class RecordDetailComponent implements OnInit {
    appointment_text!: string;

    auditLogPulseSpo2: FieldOldValueNewValue = {
        field: "Pulse Oximetry (SPO2)",
        newvalue: "",
        oldvalue: ""
    };
    auditLogBodyTemp: FieldOldValueNewValue = {
        field: "Body Temperature",
        newvalue: "",
        oldvalue: ""
    };

    auditLogBodyHeight: FieldOldValueNewValue = {
        field: "Body Height",
        newvalue: "",
        oldvalue: ""
    };

    auditLogBodyWeight: FieldOldValueNewValue = {
        field: "Body Weight",
        newvalue: "",
        oldvalue: ""
    };

    convertDateToLocale(arg0: Date) {
        return new Date(arg0).toLocaleString()
    }

    auditLogPulseRate: FieldOldValueNewValue = {
        field: "Pulse Rate",
        newvalue: "",
        oldvalue: ""
    };

    patients!: Patient[];
    appointments!: DisplayAppointment[];
    selectedPatientId!: string;
    selectedApptId!: string;
    patient_name: any;
    record!: Record;
    blood_group_select_disabled = true;

    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "records" }
    auditLogBPSys: FieldOldValueNewValue = {
        field: "BP (Systolic)",
        newvalue: "",
        oldvalue: ""
    }
    detailForm: FormGroup;
    user: User | null | undefined;

    auditLogBpDia: FieldOldValueNewValue = {
        field: "BP (Diastolic)",
        newvalue: "",
        oldvalue: ""
    };

    async transformRecordDetails() {
        this.detailForm.value.patient_id = this.selectedPatientId
        this.detailForm.value.appointment_id = this.selectedApptId
        this.detailForm.value.origin = new Date()
        let apptById = (await this.ds.getEventById(this.selectedApptId))

        if (apptById) {
            this.detailForm.value.doctor_id = apptById.doctor_id
        }

        this.detailForm.value.attributes = {};
        this.detailForm.value.attributes.blood_pressure_systolic = this.detailForm.value.blood_pressure_systolic
        this.detailForm.value.attributes.blood_pressure_diastolic = this.detailForm.value.blood_pressure_diastolic
        this.detailForm.value.attributes.blood_group = this.detailForm.value.blood_group
        this.detailForm.value.attributes.blood_antigen = this.detailForm.value.blood_antigen
        this.detailForm.value.attributes.pulse_oximetry_spo2 = this.detailForm.value.pulse_oximetry_spo2
        this.detailForm.value.attributes.pulse_rate = this.detailForm.value.pulse_rate
        this.detailForm.value.attributes.body_height = this.detailForm.value.body_height
        this.detailForm.value.attributes.body_weight = this.detailForm.value.body_weight
        this.detailForm.value.attributes.body_temperature = this.detailForm.value.body_temperature

        delete this.detailForm.value.blood_pressure_systolic
        delete this.detailForm.value.blood_pressure_diastolic
        delete this.detailForm.value.blood_group
        delete this.detailForm.value.blood_antigen
        delete this.detailForm.value.pulse_oximetry_spo2
        delete this.detailForm.value.pulse_rate
        delete this.detailForm.value.body_height
        delete this.detailForm.value.body_weight
        delete this.detailForm.value.body_temperature
    }

    async doAuditLogs() {
        let req: AuditLogRequest = {
            action: "update",
            entity_id: this.record?.id!,
            createdAt: new Date(),
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogBPSys.field,
                newvalue: this.auditLogBPSys.newvalue,
                oldvalue: this.auditLogBPSys.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogBpDia.field,
                newvalue: this.auditLogBpDia.newvalue,
                oldvalue: this.auditLogBpDia.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogPulseSpo2.field,
                newvalue: this.auditLogPulseSpo2.newvalue,
                oldvalue: this.auditLogPulseSpo2.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogBodyTemp.field,
                newvalue: this.auditLogBodyTemp.newvalue,
                oldvalue: this.auditLogBodyTemp.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogBodyHeight.field,
                newvalue: this.auditLogBodyHeight.newvalue,
                oldvalue: this.auditLogBodyHeight.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogPulseRate.field,
                newvalue: this.auditLogPulseRate.newvalue,
                oldvalue: this.auditLogPulseRate.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.record?.id!,
            email: this.user?.email!,
            entity: "medical_record",
            valueChanged: {
                field: this.auditLogBodyWeight.field,
                newvalue: this.auditLogBodyWeight.newvalue,
                oldvalue: this.auditLogBodyWeight.oldvalue
            },
            pageName: "records",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });
    }

    async update() {

        await this.transformRecordDetails()

        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.apiService.update('records', this.detailForm.value.id, this.detailForm.value);
            alert('Medical record details saved successfully.');
            this.router.navigate(['/records']);

            await this.doAuditLogs()
        }
        else {
            alert('You are not authorized to modify an existing doctor. Please contact system administrator so they can give you permissions.');
        }
    }
    @Input() public doctor: Doctor | undefined;

    onBPSysChange(newValue: string): void {
        this.auditLogBPSys.newvalue = newValue
        this.auditLogBPSys.oldvalue = this.record.attributes.blood_pressure_systolic.toString()
    }

    onBPDiaChange(newValue: string): void {
        this.auditLogBpDia.newvalue = newValue
        this.auditLogBpDia.oldvalue = this.record.attributes.blood_pressure_diastolic.toString()
    }

    onPulseSpo2Change(newValue: string): void {
        this.auditLogPulseSpo2.newvalue = newValue
        this.auditLogPulseSpo2.oldvalue = this.record.attributes.pulse_oximetry_spo2.toString()
    }

    onPulseRateChange(newValue: string): void {
        this.auditLogPulseRate.newvalue = newValue
        this.auditLogPulseRate.oldvalue = this.record.attributes.pulse_rate.toString()
    }

    onBodyTempChange(newValue: string): void {
        this.auditLogBodyTemp.newvalue = newValue
        this.auditLogBodyTemp.oldvalue = this.record.attributes.body_temperature.toString()
    }

    onBodyHeightChange(newValue: string): void {
        this.auditLogBodyHeight.newvalue = newValue
        this.auditLogBodyHeight.oldvalue = this.record.attributes.body_height.toString()
    }

    onBodyWeightChange(newValue: string): void {
       this.auditLogBodyWeight.newvalue = newValue
        this.auditLogBodyWeight.oldvalue = this.record.attributes.body_weight.toString()
    }

    error: any;
    navigated = false;


    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private ds: DataService
    ) {
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });

        this.detailForm = this.fb.group({
            patient_id: [''],
            patient_name: [''],
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

    async ngAfterViewInit(): Promise<void> {
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];
            await this.apiService.getOne("records", id).then((value: any) => {
                this.record = value[0]!
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });

        let id
        if (this.route.snapshot.params != undefined) {
            id = this.route.snapshot.params['id'];
        }

        if (id == undefined) {
            this.route.snapshot.paramMap.get('id');
        }

        if (id !== undefined) {
            this.navigated = true;
            await this.apiService.getOne("records", id).then(async (value: any) => {
                this.record = value[0]!
                this.selectedPatientId = value[0]?.patient_id
                this.selectedApptId = value[0]?.appointment_id

                const patient = (await this.apiService.getOne("patients", value[0]?.patient_id))[0];
                this.patient_name = patient?.name?.first + " " + patient?.name?.last;
                const appointment = (await this.apiService.getOne("appointments", value[0]?.appointment_id))[0];
                this.appointment_text = `${appointment?.text} on ${this.convertDateToLocale(appointment.start)}`
                this.detailForm = this.fb.group({
                    id: value[0].id,
                    blood_pressure_systolic: value[0]?.attributes?.blood_pressure_systolic,
                    blood_pressure_diastolic: value[0]?.attributes?.blood_pressure_diastolic,
                    pulse_oximetry_spo2: value[0]?.attributes?.pulse_oximetry_spo2,
                    blood_group: value[0]?.attributes?.blood_group,
                    blood_antigen: value[0]?.attributes?.blood_antigen,
                    pulse_rate: value[0]?.attributes?.pulse_rate,
                    body_temperature: value[0]?.attributes?.body_temperature,
                    body_height: value[0]?.attributes?.body_height,
                    body_weight: value[0]?.attributes?.body_weight,
                });
            })
        } else {
            this.navigated = false;

            this.detailForm = this.fb.group({
                patient_id: [''],
                patient_name: [''],
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
    }

}
