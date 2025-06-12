import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayPilot } from "@daypilot/daypilot-lite-angular";
import { HttpClient } from "@angular/common/http";
import EventData = DayPilot.EventData;
import EventId = DayPilot.EventId;
import axios from 'axios';
import { Appointment } from '../models/othermodels';
import { environment } from 'src/environment/environment.development';


@Injectable()
export class DataService {

    private apiUrl = environment.apiBaseUrl

    constructor(private http: HttpClient) {
        console.log("Entities API Base Url is ", this.apiUrl)
    }

    async getEvents() {
        return axios.get(`${this.apiUrl}/appointments`).then(res => res.data);
    }

    async getEventById(id:string) {
        return axios.get(`${this.apiUrl}/appointments/${id}`).then(res => res.data[0]);
    }

    async getEventsByDoctorId(id:string) {
        return axios.get(`${this.apiUrl}/appointments/doctor/${id}`).then(res => res.data);
    }

    async getEventsByPatientId(id:string) {
        return axios.get(`${this.apiUrl}/appointments/patient/${id}`).then(res => res.data);
    }

    async updateEventById(id:string, appointment: Appointment) {
        return axios.put(`${this.apiUrl}/appointments/${id}`,appointment).then(res => res.data);
    }

    createEvent(params: CreateEventParams): Promise<any> {
        return axios.post(`${this.apiUrl}/appointments`, params).then(res => res.data);
    }

    deleteEvent(id: EventId) {
        return axios.delete(`${this.apiUrl}/appointments/${id}`).then(res => res.data);
    }
}

export interface CreateEventParams {
    id?: string | number;
    start: string;
    end: string;
    text: string;
}

export interface MoveEventParams {
    id: EventId;
    newStart: DayPilot.Date;
    newEnd: DayPilot.Date;
}

export interface BackendResult {
    id: EventId;
    result: string;
    message: string;
}

