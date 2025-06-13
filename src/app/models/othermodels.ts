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
  specialization: string
  qualification: string
}

export interface RoleActionMap {
  _id: string
  pageName: string
  role: string
  actions: string[],
  id:string
}

export interface RoleActionMapNew extends Omit<RoleActionMap, "_id"> { }

export interface ExpandedDoctor {
  _id: string
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  dob: string
  gender: string
  specialization: string
  qualification: string
}

export interface ExpandedPatient {
  _id: string
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  dob: string
  gender: string
}

export interface ExpandedUser {
  fullname: string
  _id: string
  roles: string
  email: string

}


export interface ExpandedPage {
  page: string
  _id: string
}

export interface ExpandedRole extends Omit<Role, "selectedForUser"> { }

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
  _id: string,
  doctor_id: string
  text: string,
  patient_id: string,
  room_id: string
  start: string
  end: string
}

export interface DisplayAppointment {
  id: string,
  doctor_id: string
  text: string,
  patient_id: string,
  date: Date
}

export interface User {
  _id: string
  roles: string[]
  email: string
  createdAt: string
  doctor_id: string
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

export interface BillLineItem {
  amount: Number,
  description: string,
  id:string
}

export interface Bill {
  id: string,
  patient_id: string,
  doctor_id: string,
  appointment_id: string,
  origin: Date,
  status: string,
  total:Number,
  items: BillLineItem[]
}

export interface ExpandedBill {
  id: string,
  doctor_id: string,
  origin: Date,
  status: string,
  total:Number,
  patient_name: string,
  patient_id: string,
  doctor_name: string,
  appointment_id: string,
  appointment_reason: string,
  appointment_date: Date,
}

export interface Record {
  id: string,
  patient_id: string,
  doctor_id: string,
  appointment_id: string,
  origin: Date,
  attributes: {
    doctor_name: string
    patient_name: string
    blood_pressure_systolic: Number,
    blood_pressure_diastolic: Number,
    pulse_oximetry_spo2: Number,
    blood_group: string,
    blood_antigen: string,
    pulse_rate: Number,
    body_temperature: Number,
    body_height: Number,
    body_weight: Number,
    body_mass_index: Number
  }
}

export interface ExpandedRecord {
  patient_name: string,
  patient_id: string,
  doctor_name: string,
  appointment_id: string,
  appointment_reason: string,
  appointment_date: Date,
  origin: string,
  blood_pressure_systolic: Number,
  blood_pressure_diastolic: Number,
  pulse_oximetry_spo2: Number,
  blood_group: string,
  blood_antigen: string,
  pulse_rate: Number,
  body_temperature: Number,
  body_height: Number,
  body_weight: Number,
  body_mass_index: Number
}