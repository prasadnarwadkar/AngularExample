export interface Patient {
  _id: string
  id: string
  name: Name
  dob: string
  gender: string
  contact: Contact
  medical_history: MedicalHistory[]
  appointments: Appointment[]
}

export interface Doctor {
  _id: string
  id: string
  name: Name
  dob: string
  gender: string
  contact: Contact
  specialization:string
  qualification:string
}

export interface RoleActionMap {
  _id: string
  pageName: string
  role: string
  actions: string[]
}

export interface RoleActionMapNew extends Omit<RoleActionMap, "_id"> {}

export interface ExpandedDoctor {
  _id: string
  id: string
  firstName:string
  lastName: string
  phone: string
  email: string
  address:string
  dob: string
  gender: string
  specialization:string
  qualification:string
}

export interface ExpandedPatient {
  _id: string
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  address:string
  dob: string
  gender: string
}

export interface ExpandedUser{
  fullname: string
  _id: string
  roles: string
  email: string

}


export interface ExpandedPage{
  page: string
  _id: string
}

export interface ExpandedRole extends Omit<Role, "selectedForUser">{}

export interface Name {
  first: string
  last: string
}

export interface Contact {
  phone: string
  email: string
  address: string
}

export interface MedicalHistory {
  condition: string
  diagnosed_date: string
  treatment: string
}

export interface Appointment {
  _id:string,
  doctor_id: string
  text: string,
  patient_id:string,
  room_id:string
  start:string
  end:string
}

export interface User {
  _id: string
  roles: string[]
  email: string
  createdAt: string
}

export interface Role {
  _id: string;
  role: string;
  selectedForUser: boolean
}

export interface Action {
  action: string;
  selected: boolean
}

export interface Page {
  page: string;
}