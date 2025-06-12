import { Name } from "src/app/models/othermodels";

export interface User {
  picData: ArrayBuffer;
  _id: string;
  fullname: string;
  createdAt: string;
  roles: string[];
  isAdmin: boolean;
  email: string;
  picture: string;
  token:string;
  enabled:boolean;
  doctor_id:string;
  name:Name;
}


