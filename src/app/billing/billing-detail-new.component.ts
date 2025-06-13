import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { AuthService } from '../shared/services';
import { PermissionRequest } from '../models/models';
import { Bill, BillLineItem, DisplayAppointment, Patient } from '../models/othermodels';
import { DataService } from '../services/Dataservice';
import { MatTableDataSource } from '@angular/material/table';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { v4 } from 'uuid';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'billing-detail-new',
    templateUrl: './billing-detail-new.component.html',
    styleUrls: ['././billing.component.css']
})
export class BillingDetailNewComponent implements OnInit {
    billLineItems: BillLineItem[] = []
    billLineItemsSrc = new MatTableDataSource<BillLineItem>([]);
    @ViewChild(MatSort, { static: false })
      sort!: MatSort;
      @ViewChild(MatPaginator)
      paginator!: MatPaginator;
      
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
    }

    deleteBillLineItem(id: string, $event: MouseEvent) {
        $event.preventDefault()
        this.billLineItems.splice(this.billLineItems.findIndex(x=> x.id == id), 1)

        this.billLineItemsSrc = new MatTableDataSource<BillLineItem>(this.billLineItems);
        this.billLineItemsSrc.paginator = this.paginator
        this.billLineItemsSrc.sort = this.sort;
    }

    detailNewForm: FormGroup;
    createPermissionRequest: PermissionRequest = { "action": "create", "pageName": "bills" }
    selectedPatientId!: string;
    patients!: Patient[];
    appointments!: DisplayAppointment[];
    selectedApptId!: string;
    displayedColumns: ["amount", "description", "id", "action"] | undefined

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService,
        private fb: FormBuilder,
        private ds: DataService
    ) {
        this.displayedColumns = ["amount", "description", "id", "action"]
        this.detailNewForm = this.fb.group({
            patient_id: [''],
            doctor_id: [''],
            origin: [''],
            status: [''],
            items: [[]]
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

            console.log("Billing line items: ", this.billLineItems)

            if (this.selectedPatientId?.length > 0) {

                this.detailNewForm.value.patient_id = this.selectedPatientId
                this.detailNewForm.value.appointment_id = this.selectedApptId
                this.detailNewForm.value.origin = new Date()
                let apptById = (await this.ds.getEventById(this.selectedApptId))

                if (apptById) {
                    this.detailNewForm.value.doctor_id = apptById.doctor_id
                }

                this.detailNewForm.value.items = this.billLineItems
                this.detailNewForm.value.id = v4();
                this.detailNewForm.value.total = this.billLineItems
                    .map(x => Number(x.amount))
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

                console.log("Bill being created: ", JSON.stringify(this.detailNewForm.value))

                try {
                    await this.apiService.create("bills", this.detailNewForm.value).then((res) => {
                        alert('A bill has been successfully created for the given patient against the given appointment.');
                        this.router.navigate(['/bills']);
                    });
                }
                catch (error) {
                    alert(error)
                }
            }
            else {
                alert('Please select a patient to create a bill for.');

            }
        }
        else {
            alert('You are not authorized to create a new bill. Please contact system administrator so they can give you permissions.');
        }
    }
}
