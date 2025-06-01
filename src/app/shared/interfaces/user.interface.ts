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
}


