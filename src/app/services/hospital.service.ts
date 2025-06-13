import { Injectable } from '@angular/core';
import axios from 'axios';
import { v4 } from 'uuid'
import { environment } from 'src/environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Create an Axios instance
    apiClient = axios.create({
        headers: {
            'api-key': ''
        },
    });
  private apiUrl = environment.apiBaseUrl

  constructor() {
    console.log("Entities API Base Url is ", this.apiUrl)
  }

  async getAll(endpoint: string) {
    return this.apiClient.get(`${this.apiUrl}/${endpoint}`).then(res => res.data);
  }

  async getOne(endpoint: string, id: string) {
    return this.apiClient.get(`${this.apiUrl}/${endpoint}/${id}`).then(res => res.data);
  }

  async create(endpoint: string, data: any) {
    if (endpoint == 'patients' || endpoint == 'doctors') {
      data.name = { "first": data.firstName, "last": data.lastName }
      data.contact = { "phone": data.phone, "email": data.email, "address": data.address }
    }
    if (!data.id || data?.id?.length < 1)
      data.id = v4()
    return this.apiClient.post(`${this.apiUrl}/${endpoint}`, data).then(res => res.data);
  }

  async update(endpoint: string, id: string, data: any) {
    if (endpoint == 'patients' || endpoint == 'doctors') {
      data.name = { "first": data.firstName, "last": data.lastName }
      data.contact = { "phone": data.phone, "email": data.email, "address": data.address }
    }
    return this.apiClient.put(`${this.apiUrl}/${endpoint}/${id}`, data).then(res => res.data);
  }

  async delete(endpoint: string, id: string) {
    return this.apiClient.delete(`${this.apiUrl}/${endpoint}/${id}`).then(res => res.data);
  }
}