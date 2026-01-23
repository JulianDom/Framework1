export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'Usuarios' | 'Productos' | 'Precios' | 'Reportes' | 'Configuración';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  isActive: boolean;
  createdAt: string;
  usersCount: number; // Number of users with this role
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}
