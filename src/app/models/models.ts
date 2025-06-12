import { User } from "../shared/interfaces";
import { Role } from "./othermodels";

export interface AuthResponse {
  token: string;
  user: User;
  actions: string[],
  pageName: string
}

export interface Permission {
  email: string;
  actions: string[],
  pageName: string
}

export interface FieldOldValueNewValue {
  field: string;
  oldvalue: string,
  newvalue: string
}

export interface AuditLogRequest {
  email: string,
  action: string,
  pageName: string,
  entity:string,
  valueChanged:FieldOldValueNewValue,
  createdAt: Date,
  entity_id:string
}

export interface AuditLog extends Omit<AuditLogRequest,"valueChanged">{
  field:string,
  oldvalue:string,
  newvalue:string,
  createdAtDate:string,
  entity_id:string
}

export interface PermissionRequest extends Omit<Permission,"actions"| "email">{
  action: string,
}

export interface RoleRequest extends Omit<RoleAndDesc, "selectedForUser" | "_id"> {
}

export interface Desc{
  desc: string;
}

export type RoleAndDesc = Role & Desc

export interface EmailRequest {
  email: string
}

export interface EmailAndDoctorIdRequest {
  email: string,
  doctor_id:string
}

export interface SendEmailRequest {
  recipient: string,
  cc:string,
  subject:string,
  text:string
}

export interface IdRequest {
  id: string
}

export interface PasswordRequest {
  password: string
}
