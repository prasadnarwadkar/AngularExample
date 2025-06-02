import { Injectable } from '@angular/core';
import axios from 'axios';
import { v4 } from 'uuid'
import { config } from '../../app/config/config';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = config.apiBaseUrl

  async getAll(endpoint: string) {
    return axios.get(`${this.apiUrl}/${endpoint}`).then(res => res.data);
  }

  async getOne(endpoint: string, id: string) {
    return axios.get(`${this.apiUrl}/${endpoint}/${id}`).then(res => res.data);
  }

  async create(endpoint: string, data: any) {
    data.name = { "first": data.firstName, "last": data.lastName }
    data.contact = { "phone": data.phone, "email": data.email, "address": data.address }
    if (!data.id)
      data.id = v4()
    return axios.post(`${this.apiUrl}/${endpoint}`, data).then(res => res.data);
  }

  async update(endpoint: string, id: string, data: any) {
    data.name = { "first": data.firstName, "last": data.lastName }
    data.contact = { "phone": data.phone, "email": data.email, "address": data.address }
    return axios.put(`${this.apiUrl}/${endpoint}/${id}`, data).then(res => res.data);
  }

  async delete(endpoint: string, id: string) {
    return axios.delete(`${this.apiUrl}/${endpoint}/${id}`).then(res => res.data);
  }
}