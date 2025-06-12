import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent } from "@daypilot/daypilot-lite-angular";
import { DataService, MoveEventParams } from "../services/Dataservice";
import { firstValueFrom, of } from "rxjs";
import { Doctor, Name, Patient } from '../models/othermodels';
import { ApiService } from '../services/hospital.service';
import { v4 } from 'uuid'

@Component({
    selector: 'calendar-component',
    template: `
      <div class="column-left">
        <div class="space">
    Week:
    <button class="btn btn-small btn-success" (click)="goPrevWeek()">Previous</button>
    |
    <button class="btn btn-small btn-success" (click)="goNxtWeek()">Next</button>
</div>
          <daypilot-navigator [config]="navigatorConfig" [date]="date"></daypilot-navigator>
      </div>
      <div class="column-main">
          <daypilot-calendar #calendar [events]="events" [config]="calendarConfig"
                             (viewChange)="viewChange()"></daypilot-calendar>
      </div>
  `,
    styles: [`
      .column-left {
          width: 220px;
          float: left;
      }

      .column-main {
          margin-left: 220px;
      }
  `]
})
export class CalendarComponent implements OnInit, AfterViewInit {
    @ViewChild("calendar") calendar!: DayPilotCalendarComponent;
    @Input()
    doctor_id!: string;
    @Input()
    doctorIncharge!: Doctor;
    events!: any[];

    get date(): DayPilot.Date {
        return this.calendarConfig.startDate as DayPilot.Date;
    }

    addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }


    async goPrevWeek() {
        this.calendar.control.startDate = new DayPilot.Date(this.addDays(new Date(this.calendar.control.startDate?.toString()!), -7))
        this.calendar.control.update()
    }

    async goNxtWeek() {
        this.calendar.control.startDate = new DayPilot.Date(this.addDays(new Date(this.calendar.control.startDate?.toString()!), 7))
        this.calendar.control.update()
    }

    set date(val: DayPilot.Date) {
        this.calendarConfig.startDate = val;
    }

    navigatorConfig: DayPilot.NavigatorConfig = {
        selectMode: "Week",
        showMonths: 3,
        skipMonths: 3
    };

    calendarConfig: DayPilot.CalendarConfig = {
        startDate: DayPilot.Date.today(),
        eventMoveHandling: "Disabled",
        eventResizeHandling: "Disabled",
        viewType: "Week",
        eventDeleteHandling: "Update",
        onEventDeleted: async args => {
            let deleteResult = (await this.ds.deleteEvent(args.e.id()))
            console.log("onEventDeleted", JSON.stringify(deleteResult));

            alert("The selected appointment was deleted successfully.")

            let events = (await this.ds.getEventsByDoctorId(this.doctor_id));
            this.events = events
        },
        onEventClick: async args => {
            let thisAppointment = (await this.ds.getEventById(args.e.id().toString()));
            let patients = (await this.apiService.getAll('patients'));

            let myoptions: { id: string; name: string }[] = []
            patients.forEach((element: { id: any; name: Name }) => {
                myoptions.push({ id: element.id, name: element.name?.first + " " + element.name?.last })
            });
            const form = [
                { name: `Dr. ${this.doctorIncharge.name.first}  ${this.doctorIncharge.name.last}`, id: "doctorName", disabled: true },
                { name: "Reason", id: "text" },
                { name: "Notes", id: "notes", type: "textarea" },
                { name: "Start", id: "start", type: "datetime" },
                { name: "End", id: "end", type: "datetime" },
                { name: "Patient", id: "patient_id", options: myoptions },

            ];

            const data = {
                id: thisAppointment.id,
                start: thisAppointment.start,
                end: thisAppointment.end,
                patient_id: thisAppointment.patient_id,
                text: thisAppointment.text,
                doctor_id: this.doctor_id,
                room_id: "1",
                _id: thisAppointment._id,
                notes: thisAppointment.notes
            };

            const modal = await DayPilot.Modal.form(form, data);


            this.calendar.control.clearSelection();

            if (modal.canceled) {
                return;
            }

            let result = await this.ds.updateEventById(modal.result._id, modal.result);
            await firstValueFrom(of(result));

            alert("The selected appointment was updated successfully.")

            let events = (await this.ds.getEventsByDoctorId(this.doctor_id));
            this.events = events
        },
        onTimeRangeSelected: async args => {

            let patients = (await this.apiService.getAll('patients'));

            let myoptions: { id: string; name: string }[] = []
            patients.forEach((element: { id: any; name: Name }) => {
                myoptions.push({ id: element.id, name: element.name?.first + " " + element.name?.last })
            });

            const form = [
                { name: `Dr. ${this.doctorIncharge.name.first}  ${this.doctorIncharge.name.last}`, id: "doctorName", disabled: true },
                { name: "Reason", id: "text" },
                { name: "Notes", id: "notes", type: "textarea" },
                { name: "Start", id: "start", type: "datetime" },
                { name: "End", id: "end", type: "datetime" },
                { name: "Patient", id: "patient_id", options: myoptions },
            ];

            const data = {
                start: args.start,
                end: args.end,
                patient_id: "2"
            };

            const modal = await DayPilot.Modal.form(form, data);

            this.calendar.control.clearSelection();

            if (modal.canceled) {
                return;
            }

            modal.result.doctor_id = this.doctor_id
            modal.result.id = v4();

            let result = await this.ds.createEvent(modal.result);
            await firstValueFrom(of(result));

            alert("An appointment was scheduled successfully.")

            result = (await this.ds.getEventsByDoctorId(this.doctor_id));
            this.events = result
        }
    };

    constructor(private ds: DataService, private apiService: ApiService) {
    }

    async ngOnInit(): Promise<void> {
        await this.apiService.getOne("doctors", this.doctor_id).then((value: any) => {
            this.doctorIncharge = value[0]!
        });
    }

    async ngAfterViewInit(): Promise<void> {
        let result = (await this.ds.getEventsByDoctorId(this.doctor_id));
        this.events = result
        console.log(result)
    }

    async viewChange() {
        let result = (await this.ds.getEventsByDoctorId(this.doctor_id));
        this.events = result
        console.log(result)
    }

}
