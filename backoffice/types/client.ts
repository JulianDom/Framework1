export interface Client {
  id: string;
  name: string;
  businessName: string;
  cuit: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  contactPerson: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClientFormData {
  name: string;
  businessName: string;
  cuit: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  contactPerson: string;
  contactPhone: string;
  isActive: boolean;
}
