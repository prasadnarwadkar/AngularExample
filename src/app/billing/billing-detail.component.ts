import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { DisplayAppointment, Doctor, Patient, User, Bill, BillLineItem } from '../models/othermodels';
import { PermissionRequest, AuditLogRequest, FieldOldValueNewValue } from '../models/models';
import { AuthService } from '../shared/services';
import { DataService } from '../services/Dataservice';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { v4 } from 'uuid';


@Component({
    selector: 'billing-detail',
    templateUrl: './billing-detail.component.html',
    styleUrls: ['././billing.component.css']
})
export class BillingDetailComponent implements OnInit {
    
    billLineItems: BillLineItem[] = []
    billLineItemsSrc = new MatTableDataSource<BillLineItem>([]);
    @ViewChild(MatSort, { static: false })
    sort!: MatSort;
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    appointment_text!: string;
    displayedColumns: string[];
    doctor_name!: string;

    async addBillLineItem() {

        const form = [

            { name: "Amount", id: "amount", type: "text" },
            { name: "Description", id: "description", type: "textarea" },

        ];

        const data = {
            id: v4()
        };

        const modal = await DayPilot.Modal.form(form, data);

        if (modal.canceled) {
            return;
        }

        if (!parseFloat(modal.result.amount)) {
            alert("Please enter only numbers in amount field")
            return;
        }

        this.billLineItems.push(modal.result)

        this.billLineItemsSrc = new MatTableDataSource<BillLineItem>(this.billLineItems);
        this.billLineItemsSrc.paginator = this.paginator
        this.billLineItemsSrc.sort = this.sort;

        this.detailForm.value.total = this.billLineItems
            .map(x => Number(x.amount))
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        
        this.detailForm.patchValue({ total: this.detailForm.value.total });
    }

    deleteBillLineItem(id: string, $event: MouseEvent) {
        $event.preventDefault()
        this.billLineItems.splice(this.billLineItems.findIndex(x => x.id == id), 1)

        this.billLineItemsSrc = new MatTableDataSource<BillLineItem>(this.billLineItems);
        this.billLineItemsSrc.paginator = this.paginator
        this.billLineItemsSrc.sort = this.sort;

        this.detailForm.value.total = this.billLineItems
            .map(x => Number(x.amount))
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        this.detailForm.patchValue({ total: this.detailForm.value.total });
    }

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
    bill!: Bill;
    blood_group_select_disabled = true;

    updatePermissionRequest: PermissionRequest = { "action": "update", "pageName": "bills" }
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

    async transformBillDetails() {
        this.detailForm.value.patient_id = this.selectedPatientId
        this.detailForm.value.appointment_id = this.selectedApptId
        this.detailForm.value.origin = new Date()
        let apptById = (await this.ds.getEventById(this.selectedApptId))

        if (apptById) {
            this.detailForm.value.doctor_id = apptById.doctor_id
        }

        this.detailForm.value.items = this.billLineItems
    }

    async doAuditLogs() {
        let req: AuditLogRequest = {
            action: "update",
            entity_id: this.bill?.id!,
            createdAt: new Date(),
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogBPSys.field,
                newvalue: this.auditLogBPSys.newvalue,
                oldvalue: this.auditLogBPSys.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogBpDia.field,
                newvalue: this.auditLogBpDia.newvalue,
                oldvalue: this.auditLogBpDia.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogPulseSpo2.field,
                newvalue: this.auditLogPulseSpo2.newvalue,
                oldvalue: this.auditLogPulseSpo2.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogBodyTemp.field,
                newvalue: this.auditLogBodyTemp.newvalue,
                oldvalue: this.auditLogBodyTemp.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogBodyHeight.field,
                newvalue: this.auditLogBodyHeight.newvalue,
                oldvalue: this.auditLogBodyHeight.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogPulseRate.field,
                newvalue: this.auditLogPulseRate.newvalue,
                oldvalue: this.auditLogPulseRate.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });

        req = {
            action: "update",
            createdAt: new Date(),
            entity_id: this.bill?.id!,
            email: this.user?.email!,
            entity: "bill",
            valueChanged: {
                field: this.auditLogBodyWeight.field,
                newvalue: this.auditLogBodyWeight.newvalue,
                oldvalue: this.auditLogBodyWeight.oldvalue
            },
            pageName: "bills",
        }

        await this.authService.createAuditLog(req!).then((res) => {

        });
    }

    async update() {

        await this.transformBillDetails()

        this.detailForm.value.total = this.billLineItems
            .map(x => Number(x.amount))
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        if (await this.authService.hasPermission(this.updatePermissionRequest.action, this.updatePermissionRequest.pageName)) {
            await this.apiService.update('bills', this.detailForm.value.id, this.detailForm.value);
            alert('Bill details saved successfully.');
            this.router.navigate(['/bills']);

            await this.doAuditLogs()
        }
        else {
            alert('You are not authorized to modify an existing doctor. Please contact system administrator so they can give you permissions.');
        }
    }
    @Input() public doctor: Doctor | undefined;

    onBPSysChange(newValue: string): void {
        this.auditLogBPSys.newvalue = newValue
        //todo
        //this.auditLogBPSys.oldvalue = this.bill.attributes.blood_pressure_systolic.toString()
    }

    onBPDiaChange(newValue: string): void {
        this.auditLogBpDia.newvalue = newValue
        //todo
        //this.auditLogBpDia.oldvalue = this.bill.attributes.blood_pressure_diastolic.toString()
    }

    onPulseSpo2Change(newValue: string): void {
        this.auditLogPulseSpo2.newvalue = newValue
        //todo
        //this.auditLogPulseSpo2.oldvalue = this.bill.attributes.pulse_oximetry_spo2.toString()
    }

    onPulseRateChange(newValue: string): void {
        this.auditLogPulseRate.newvalue = newValue
        //todo
        //this.auditLogPulseRate.oldvalue = this.bill.attributes.pulse_rate.toString()
    }

    onBodyTempChange(newValue: string): void {
        this.auditLogBodyTemp.newvalue = newValue
        //todo
        //this.auditLogBodyTemp.oldvalue = this.bill.attributes.body_temperature.toString()
    }

    onBodyHeightChange(newValue: string): void {
        this.auditLogBodyHeight.newvalue = newValue
        //todo
        //this.auditLogBodyHeight.oldvalue = this.bill.attributes.body_height.toString()
    }

    onBodyWeightChange(newValue: string): void {
        this.auditLogBodyWeight.newvalue = newValue
        //this.auditLogBodyWeight.oldvalue = this.bill.attributes.body_weight.toString()
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
        this.displayedColumns = ["amount", "description", "action"]

        this.authService.getUser().subscribe(async x => {
            this.user = x!
        });

        this.detailForm = this.fb.group({
            patient_id: [''],
            patient_name: [''],
            doctor_id: [''],
            origin: [''],
            total: [''],
            status: ['']
        });
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];
            await this.apiService.getOne("bills", id).then((value: any) => {
                this.bill = value[0]!
                this.billLineItems = value[0]?.items

                this.billLineItemsSrc = new MatTableDataSource<BillLineItem>(this.billLineItems);
                this.billLineItemsSrc.paginator = this.paginator
                this.billLineItemsSrc.sort = this.sort;
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
            await this.apiService.getOne("bills", id).then(async (value: any) => {
                this.bill = value[0]!
                this.selectedPatientId = value[0]?.patient_id
                this.selectedApptId = value[0]?.appointment_id

                const doctor = (await this.apiService.getOne("doctors", value[0]?.doctor_id))[0];
                const patient = (await this.apiService.getOne("patients", value[0]?.patient_id))[0];
                this.patient_name = patient?.name?.first + " " + patient?.name?.last;
                this.doctor_name = doctor?.name?.first + " " + doctor?.name?.last;
                const appointment = (await this.apiService.getOne("appointments", value[0]?.appointment_id))[0];
                this.appointment_text = `${appointment?.text} on ${this.convertDateToLocale(appointment.start)}`
                this.detailForm = this.fb.group({
                    id: value[0].id,
                    status: value[0]?.status,
                    total: value[0]?.total,
                    origin: value[0]?.origin,
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
