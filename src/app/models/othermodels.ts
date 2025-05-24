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

export interface RoleActionMap {
  _id: string
  pageName: string
  rolename: string
  actions: string[]
}

export interface RoleActionMapNew {
  pageName: string
  rolename: string
  actions: string[]
}

export interface ExpandedRoleActionMap {
  _id: string
  pageName: string
  rolename: string
  actions: string[]
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

export interface ExpandedRole{
  role: string
  _id: string
}

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
  doctor_id: string
  date: string
  time: string
  reason: string
}

export interface User {
  _id: string
  roles: string[]
  fullName: string
  email: string
  hashedPassword:string
  createdAt: Date
}