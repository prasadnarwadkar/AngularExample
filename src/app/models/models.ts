import { User } from "../shared/interfaces";

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

export interface PermissionRequest {
  action: string,
  pageName: string
}

export interface RoleRequest {
  role: string
}

export interface PageRequest {
  page: string
}