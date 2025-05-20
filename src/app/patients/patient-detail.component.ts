import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { HeroService } from '../services/hero.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/hospital.service';
import { Patient } from '../models/patient';


@Component({
    selector: 'patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['././patient.component.css']
})
export class PatientDetailComponent implements OnInit {
    patientDetailForm: FormGroup;
    async updatePatient() {
        await this.apiService.update('patients', this.patientDetailForm.value.id, this.patientDetailForm.value);
        this.router.navigate(['/patients']);
    }
    @Input() public patient: Patient | undefined;
    @Output() closeTheHeroSaveDlg = new EventEmitter<Hero>();
    error: any;
    navigated = false; // true if navigated here
    patientForm: any;

    constructor(
        private router: Router,
        private apiService: ApiService,

        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.patientDetailForm = this.fb.group({
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
        if (this.route.snapshot.params != undefined) {
            const id = this.route.snapshot.params['id'];

            if (id !== undefined) {
                this.navigated = true;
                await this.apiService.getOne("patients", id).then((value: any) => {
                    console.log(value)
                    this.patient = value[0]!

                    this.patientDetailForm = this.fb.group({
                        id: value[0].id,
                        firstName: this.patient?.name.first,
                        lastName: this.patient?.name.last,
                        dob:this.patient?.dob,
                        gender: this.patient?.gender,
                        phone: this.patient?.contact.phone,
                        email: this.patient?.contact.email,
                        address: this.patient?.contact.address,
                    });
                })
            } else {
                this.navigated = false;
                this.patient = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    appointments: [],
                    medical_history: [],
                    _id: ""


                }
            }
        }
        else {
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== undefined) {
                this.navigated = true;
                (await this.apiService.getOne("patients", id!)).subscribe((patient: Patient) => (this.patient = patient));
            } else {
                this.navigated = false;
                this.patient = {
                    id: "",
                    dob: "",
                    name: { first: "", last: "" },
                    gender: "",
                    contact: { phone: "", address: "", email: "" },
                    appointments: [],
                    medical_history: [],
                    _id: ""


                }
            }
        }
    }

    async save(): Promise<any> {
        if (this.patient && this.patient.name && this.patient.name.first.length > 0) {

            try {
                await this.apiService.update("patients", this.patient.id, this.patient).then((res) => {
                    this.router.navigate(['/heroes']);
                });
            }
            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Name of the hero can\'t be blank');

        }
    }

    goBack(savedHero: Hero | undefined): void {
        console.log("Saved Hero is: " + JSON.stringify(savedHero));

        if (!savedHero) {
            this.closeTheHeroSaveDlg.emit(undefined);

            this.route.url.subscribe((val) => {
                if (val.length > 0) {
                    if (val[0].path == "detail") {
                        this.router.navigate(['/heroes']);
                    }
                }
            },
                (error) => {
                });
        }
        else {

            this.closeTheHeroSaveDlg.emit(savedHero);
            this.router.navigate(['/heroes']);
        }
    }
}
