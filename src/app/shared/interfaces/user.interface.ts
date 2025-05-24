export interface User {
  _id: string;
  fullname: string;
  createdAt: string;
  roles: string[];
  isAdmin: boolean;
  email: string;
  picture: string;
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
  _id: string;
  page: string;
}
