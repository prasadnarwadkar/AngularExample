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

export interface RoleRequest extends Omit<Role, "selectedForUser" | "_id"> {
  role: string
}

export interface EmailRequest {
  email: string
}

export interface PasswordRequest {
  password: string
}
