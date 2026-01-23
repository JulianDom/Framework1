export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}
