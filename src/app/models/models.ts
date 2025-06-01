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

export interface IdRequest {
  id: string
}

export interface PasswordRequest {
  password: string
}
