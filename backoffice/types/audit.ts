export type AuditActionType = 
  | 'login' 
  | 'logout' 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'export' 
  | 'config_change'
  | 'status_change';

export type AuditModule = 
  | 'users' 
  | 'roles' 
  | 'clients' 
  | 'projects' 
  | 'tasks' 
  | 'reports' 
  | 'settings' 
  | 'system';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditActionType;
  module: AuditModule;
  description: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilter {
  searchTerm: string;
  actionType: AuditActionType | 'all';
  module: AuditModule | 'all';
  startDate: string;
  endDate: string;
  userId: string;
}

export const auditActionLabels: Record<AuditActionType, string> = {
  login: 'Inicio de sesión',
  logout: 'Cierre de sesión',
  create: 'Crear',
  update: 'Actualizar',
  delete: 'Eliminar',
  view: 'Ver',
  export: 'Exportar',
  config_change: 'Cambio de configuración',
  status_change: 'Cambio de estado',
};

export const auditActionColors: Record<AuditActionType, { bg: string; text: string }> = {
  login: { bg: 'bg-blue-100', text: 'text-blue-800' },
  logout: { bg: 'bg-gray-100', text: 'text-gray-800' },
  create: { bg: 'bg-green-100', text: 'text-green-800' },
  update: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  delete: { bg: 'bg-red-100', text: 'text-red-800' },
  view: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  export: { bg: 'bg-purple-100', text: 'text-purple-800' },
  config_change: { bg: 'bg-orange-100', text: 'text-orange-800' },
  status_change: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
};

export const auditModuleLabels: Record<AuditModule, string> = {
  users: 'Usuarios',
  roles: 'Roles',
  clients: 'Clientes',
  projects: 'Proyectos',
  tasks: 'Tareas',
  reports: 'Reportes',
  settings: 'Configuración',
  system: 'Sistema',
};
