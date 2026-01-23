'use client';

import { useState } from 'react';
import { UserList } from '@/components/UserList';
import { UserForm } from '@/components/UserForm';
import { RoleList } from '@/components/RoleList';
import { RoleForm } from '@/components/RoleForm';
import { ClientList } from '@/components/ClientList';
import { ClientForm } from '@/components/ClientForm';
import { ProjectList } from '@/components/ProjectList';
import { ProjectForm } from '@/components/ProjectForm';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { ReportView } from '@/components/ReportView';
import { SettingsView } from '@/components/SettingsView';
import { AuditLogList } from '@/components/AuditLogList';
import { Sidebar, NavigationView } from '@/components/Sidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { User, UserFormData } from '@/types/user';
import { Role, RoleFormData, Permission } from '@/types/role';
import { Client, ClientFormData } from '@/types/client';
import { Project, ProjectFormData } from '@/types/project';
import { Task, TaskFormData } from '@/types/task';
import { SystemSettings } from '@/types/settings';
import { AuditLog } from '@/types/audit';

// Mock data - Users
const initialUsers: User[] = [
  {
    id: '1',
    name: 'María González',
    username: 'mgonzalez',
    email: 'maria.gonzalez@empresa.com',
    role: 'Relevador',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    username: 'crodriguez',
    email: 'carlos.rodriguez@empresa.com',
    role: 'Supervisor',
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    username: 'amartinez',
    email: 'ana.martinez@empresa.com',
    role: 'Relevador',
    isActive: false,
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Pedro López',
    username: 'plopez',
    email: 'pedro.lopez@empresa.com',
    role: 'Coordinador',
    isActive: true,
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Laura Fernández',
    username: 'lfernandez',
    email: 'laura.fernandez@empresa.com',
    role: 'Relevador',
    isActive: true,
    createdAt: '2024-02-15',
  },
];

// Mock data - Permissions
const allPermissions: Permission[] = [
  // Usuarios
  {
    id: 'user-view',
    name: 'Ver usuarios',
    description: 'Permite visualizar la lista de usuarios del sistema',
    category: 'Usuarios',
  },
  {
    id: 'user-create',
    name: 'Crear usuarios',
    description: 'Permite agregar nuevos usuarios al sistema',
    category: 'Usuarios',
  },
  {
    id: 'user-edit',
    name: 'Editar usuarios',
    description: 'Permite modificar datos de usuarios existentes',
    category: 'Usuarios',
  },
  {
    id: 'user-delete',
    name: 'Eliminar usuarios',
    description: 'Permite eliminar usuarios del sistema',
    category: 'Usuarios',
  },
  // Productos
  {
    id: 'product-view',
    name: 'Ver productos',
    description: 'Permite consultar el catálogo de productos',
    category: 'Productos',
  },
  {
    id: 'product-create',
    name: 'Crear productos',
    description: 'Permite agregar nuevos productos al catálogo',
    category: 'Productos',
  },
  {
    id: 'product-edit',
    name: 'Editar productos',
    description: 'Permite modificar información de productos',
    category: 'Productos',
  },
  // Precios
  {
    id: 'price-view',
    name: 'Ver precios',
    description: 'Permite consultar precios relevados',
    category: 'Precios',
  },
  {
    id: 'price-create',
    name: 'Relevar precios',
    description: 'Permite cargar nuevos precios desde puntos de venta',
    category: 'Precios',
  },
  {
    id: 'price-edit',
    name: 'Editar precios',
    description: 'Permite corregir precios ya relevados',
    category: 'Precios',
  },
  {
    id: 'price-approve',
    name: 'Aprobar precios',
    description: 'Permite validar y aprobar precios relevados',
    category: 'Precios',
  },
  // Reportes
  {
    id: 'report-view',
    name: 'Ver reportes',
    description: 'Permite acceder a reportes y estadísticas',
    category: 'Reportes',
  },
  {
    id: 'report-export',
    name: 'Exportar reportes',
    description: 'Permite descargar reportes en formatos Excel/PDF',
    category: 'Reportes',
  },
  // Configuración
  {
    id: 'config-view',
    name: 'Ver configuración',
    description: 'Permite acceder a la configuración del sistema',
    category: 'Configuración',
  },
  {
    id: 'config-edit',
    name: 'Modificar configuración',
    description: 'Permite cambiar parámetros del sistema',
    category: 'Configuración',
  },
];

// Mock data - Roles
const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Relevador',
    description: 'Usuario operativo que carga precios desde puntos de venta',
    permissions: ['product-view', 'price-view', 'price-create'],
    isActive: true,
    createdAt: '2024-01-10',
    usersCount: 3,
  },
  {
    id: '2',
    name: 'Supervisor',
    description: 'Supervisa el trabajo de relevadores y valida información',
    permissions: [
      'product-view',
      'price-view',
      'price-create',
      'price-edit',
      'price-approve',
      'report-view',
      'user-view',
    ],
    isActive: true,
    createdAt: '2024-01-10',
    usersCount: 1,
  },
  {
    id: '3',
    name: 'Coordinador',
    description: 'Coordina operaciones y gestiona productos y reportes',
    permissions: [
      'user-view',
      'product-view',
      'product-create',
      'product-edit',
      'price-view',
      'price-create',
      'price-edit',
      'price-approve',
      'report-view',
      'report-export',
    ],
    isActive: true,
    createdAt: '2024-01-10',
    usersCount: 1,
  },
  {
    id: '4',
    name: 'Administrador',
    description: 'Acceso completo al sistema y configuración',
    permissions: allPermissions.map((p) => p.id),
    isActive: true,
    createdAt: '2024-01-10',
    usersCount: 0,
  },
];

// Mock data - Clients
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Supermercados del Sur S.A.',
    businessName: 'Supermercados del Sur Sociedad Anónima',
    cuit: '30-71234567-8',
    email: 'info@supermercadosdelsur.com.ar',
    phone: '+54 11 4567-8900',
    address: 'Av. Libertador 5500',
    city: 'Buenos Aires',
    country: 'Argentina',
    contactPerson: 'Juan Pérez',
    contactPhone: '+54 11 4567-8901',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Farmacias Salud Total',
    businessName: 'Farmacias Salud Total S.R.L.',
    cuit: '30-98765432-1',
    email: 'contacto@farmaciasaludtotal.com.ar',
    phone: '+54 11 5678-9012',
    address: 'Calle Corrientes 1234',
    city: 'Córdoba',
    country: 'Argentina',
    contactPerson: 'María López',
    contactPhone: '+54 11 5678-9013',
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Electrohogar Tech',
    businessName: 'Electrohogar Tech S.A.',
    cuit: '33-11223344-5',
    email: 'ventas@electrohogartech.com.ar',
    phone: '+54 341 456-7890',
    address: 'Av. Pellegrini 2500',
    city: 'Rosario',
    country: 'Argentina',
    contactPerson: 'Carlos Rodríguez',
    contactPhone: '+54 341 456-7891',
    isActive: false,
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Indumentaria Fashion Style',
    businessName: 'Fashion Style Indumentaria S.R.L.',
    cuit: '30-55667788-9',
    email: 'info@fashionstyle.com.ar',
    phone: '+54 261 789-0123',
    address: 'Calle San Martín 890',
    city: 'Mendoza',
    country: 'Argentina',
    contactPerson: 'Ana Martínez',
    contactPhone: '+54 261 789-0124',
    isActive: true,
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Distribuidora Alimentos Frescos',
    businessName: 'Alimentos Frescos Distribuidora S.A.',
    cuit: '30-99887766-2',
    email: 'pedidos@alimentosfrescos.com.ar',
    phone: '+54 221 234-5678',
    address: 'Av. 7 N° 1650',
    city: 'La Plata',
    country: 'Argentina',
    contactPerson: 'Pedro López',
    contactPhone: '+54 221 234-5679',
    isActive: true,
    createdAt: '2024-02-15',
  },
];

// Mock data - Projects
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Relevamiento Supermercados Q1 2024',
    clientId: '1',
    clientName: 'Supermercados del Sur S.A.',
    description: 'Relevamiento de precios en 120 sucursales durante el primer trimestre',
    status: 'in-progress',
    startDate: '2024-01-15',
    endDate: '2024-03-31',
    budget: 2500000,
    responsiblePerson: 'Carlos Rodríguez',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Monitoreo Farmacias Región Centro',
    clientId: '2',
    clientName: 'Farmacias Salud Total',
    description: 'Control de precios de medicamentos en farmacias de Córdoba y alrededores',
    status: 'planning',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    budget: 1800000,
    responsiblePerson: 'María González',
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Análisis Electrodomésticos 2024',
    clientId: '3',
    clientName: 'Electrohogar Tech',
    description: 'Estudio de precios de electrodomésticos en competidores directos',
    status: 'cancelled',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    budget: 1200000,
    responsiblePerson: 'Ana Martínez',
    isActive: false,
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Tendencias Moda Temporada Otoño',
    clientId: '4',
    clientName: 'Indumentaria Fashion Style',
    description: 'Relevamiento de precios de indumentaria para análisis de temporada',
    status: 'completed',
    startDate: '2024-02-10',
    endDate: '2024-03-15',
    budget: 950000,
    responsiblePerson: 'Pedro López',
    isActive: true,
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Precios Frescos Mensual',
    clientId: '5',
    clientName: 'Distribuidora Alimentos Frescos',
    description: 'Monitoreo mensual de precios de productos frescos en mercados',
    status: 'paused',
    startDate: '2024-02-15',
    endDate: '2024-12-31',
    budget: 3200000,
    responsiblePerson: 'Laura Fernández',
    isActive: true,
    createdAt: '2024-02-15',
  },
];

// Mock data - Tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar catálogo de productos',
    description: 'Definir y cargar el catálogo completo de productos a relevar',
    projectId: '1',
    projectName: 'Relevamiento Supermercados Q1 2024',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Carlos Rodríguez',
    dueDate: '2024-01-20',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Capacitar relevadores en puntos de venta',
    description: 'Realizar capacitación sobre el uso de la app móvil',
    projectId: '1',
    projectName: 'Relevamiento Supermercados Q1 2024',
    status: 'completed',
    priority: 'high',
    assignedTo: 'María González',
    dueDate: '2024-01-25',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Relevar sucursales zona norte',
    description: 'Visitar y relevar precios en 40 sucursales de zona norte',
    projectId: '1',
    projectName: 'Relevamiento Supermercados Q1 2024',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Ana Martínez',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    title: 'Validar precios cargados',
    description: 'Revisar y aprobar los precios relevados en enero',
    projectId: '2',
    projectName: 'Monitoreo Farmacias Región Centro',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Pedro López',
    dueDate: '2024-03-05',
    createdAt: '2024-02-20',
  },
  {
    id: '5',
    title: 'Generar reporte mensual',
    description: 'Crear reporte consolidado de variaciones de precios',
    projectId: '2',
    projectName: 'Monitoreo Farmacias Región Centro',
    status: 'pending',
    priority: 'low',
    assignedTo: 'Laura Fernández',
    dueDate: '2024-03-10',
    createdAt: '2024-02-25',
  },
];

// Mock data - System Settings
const initialSettings: SystemSettings = {
  id: '1',
  name: 'Configuración del Sistema',
  description: 'Configuración general del sistema',
  isActive: true,
  createdAt: '2024-01-10',
  settings: {
    theme: 'dark',
    language: 'es',
    notifications: true,
    autoSave: true,
    backupFrequency: 'weekly',
  },
};

// Mock data - Audit Logs
const initialAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00',
    userId: '1',
    userName: 'María González',
    action: 'login',
    module: 'system',
    description: 'Inicio de sesión exitoso en el sistema',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: '2',
    timestamp: '2024-01-15T11:45:00',
    userId: '2',
    userName: 'Carlos Rodríguez',
    action: 'create',
    module: 'users',
    description: 'Creación de nuevo usuario: Juan Pérez',
    details: {
      newUserEmail: 'juan.perez@empresa.com',
      role: 'Relevador',
    },
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '3',
    timestamp: '2024-01-20T14:45:00',
    userId: '2',
    userName: 'Carlos Rodríguez',
    action: 'update',
    module: 'roles',
    description: 'Modificación de permisos del rol Relevador',
    details: {
      roleName: 'Relevador',
      addedPermissions: ['price-view', 'product-view'],
    },
    ipAddress: '192.168.1.120',
  },
  {
    id: '4',
    timestamp: '2024-02-01T09:15:00',
    userId: '3',
    userName: 'Ana Martínez',
    action: 'status_change',
    module: 'clients',
    description: 'Desactivación del cliente: Electrohogar Tech',
    details: {
      clientId: '3',
      previousStatus: 'active',
      newStatus: 'inactive',
    },
    ipAddress: '192.168.1.135',
  },
  {
    id: '5',
    timestamp: '2024-02-10T11:00:00',
    userId: '4',
    userName: 'Pedro López',
    action: 'create',
    module: 'projects',
    description: 'Creación de nuevo proyecto: Relevamiento Supermercados Q1 2024',
    details: {
      projectName: 'Relevamiento Supermercados Q1 2024',
      client: 'Supermercados del Sur S.A.',
      budget: 2500000,
    },
    ipAddress: '192.168.1.142',
  },
  {
    id: '6',
    timestamp: '2024-02-15T16:30:00',
    userId: '5',
    userName: 'Laura Fernández',
    action: 'update',
    module: 'tasks',
    description: 'Modificación de la tarea: Generar reporte mensual',
    details: {
      taskId: '5',
      changes: ['priority', 'dueDate'],
    },
    ipAddress: '192.168.1.150',
  },
  {
    id: '7',
    timestamp: '2024-02-20T08:00:00',
    userId: '1',
    userName: 'María González',
    action: 'export',
    module: 'reports',
    description: 'Exportación de reporte de proyectos a CSV',
    details: {
      reportType: 'projects',
      period: 'month',
      recordCount: 45,
    },
    ipAddress: '192.168.1.105',
  },
  {
    id: '8',
    timestamp: '2024-02-22T13:20:00',
    userId: '2',
    userName: 'Carlos Rodríguez',
    action: 'config_change',
    module: 'settings',
    description: 'Modificación de configuración del sistema',
    details: {
      changes: {
        sessionTimeout: { from: 30, to: 60 },
        emailNotifications: { from: false, to: true },
      },
    },
    ipAddress: '192.168.1.120',
  },
  {
    id: '9',
    timestamp: '2024-02-25T10:05:00',
    userId: '4',
    userName: 'Pedro López',
    action: 'delete',
    module: 'users',
    description: 'Eliminación de usuario: Roberto Sánchez',
    details: {
      deletedUserEmail: 'roberto.sanchez@empresa.com',
      reason: 'Baja laboral',
    },
    ipAddress: '192.168.1.142',
  },
  {
    id: '10',
    timestamp: '2024-02-28T17:45:00',
    userId: '1',
    userName: 'María González',
    action: 'logout',
    module: 'system',
    description: 'Cierre de sesión del sistema',
    ipAddress: '192.168.1.105',
  },
  {
    id: '11',
    timestamp: '2024-03-01T09:30:00',
    userId: '3',
    userName: 'Ana Martínez',
    action: 'view',
    module: 'reports',
    description: 'Visualización del reporte de tareas',
    details: {
      reportType: 'tasks',
      filters: { status: 'in-progress' },
    },
    ipAddress: '192.168.1.135',
  },
  {
    id: '12',
    timestamp: '2024-03-05T14:15:00',
    userId: '5',
    userName: 'Laura Fernández',
    action: 'create',
    module: 'tasks',
    description: 'Creación de nueva tarea: Validar precios cargados',
    details: {
      projectName: 'Monitoreo Farmacias Región Centro',
      priority: 'high',
      dueDate: '2024-03-15',
    },
    ipAddress: '192.168.1.150',
  },
];

export default function Home() {
  // Navigation state
  const [activeView, setActiveView] = useState<NavigationView>('users');

  // Users state
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null);
  const [toggleStatusUser, setToggleStatusUser] = useState<User | null>(null);

  // Roles state
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Clients state
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogClient, setDeleteDialogClient] = useState<Client | null>(null);
  const [toggleStatusClient, setToggleStatusClient] = useState<Client | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogProject, setDeleteDialogProject] = useState<Project | null>(null);
  const [toggleStatusProject, setToggleStatusProject] = useState<Project | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogTask, setDeleteDialogTask] = useState<Task | null>(null);
  const [toggleStatusTask, setToggleStatusTask] = useState<Task | null>(null);

  // System Settings state
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [isSettingsViewOpen, setIsSettingsViewOpen] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // === USER HANDLERS ===

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
      toast.success('Usuario actualizado', {
        description: `Los datos de ${userData.name} han sido actualizados correctamente.`,
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success('Usuario creado', {
        description: `${userData.name} ha sido agregado al sistema.`,
      });
    }
  };

  const handleConfirmToggleStatus = () => {
    if (toggleStatusUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === toggleStatusUser.id
            ? { ...user, isActive: !user.isActive }
            : user
        )
      );

      if (toggleStatusUser.isActive) {
        toast.warning('Usuario desactivado', {
          description: `${toggleStatusUser.name} ya no podrá acceder al sistema.`,
        });
      } else {
        toast.success('Usuario activado', {
          description: `${toggleStatusUser.name} ahora puede acceder al sistema.`,
        });
      }

      setToggleStatusUser(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialogUser) {
      setUsers((prev) => prev.filter((user) => user.id !== deleteDialogUser.id));
      toast.success('Usuario eliminado', {
        description: `${deleteDialogUser.name} ha sido eliminado del sistema.`,
      });
      setDeleteDialogUser(null);
    }
  };

  // === ROLE HANDLERS ===

  const handleCreateRole = () => {
    setEditingRole(null);
    setIsRoleFormOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleFormOpen(true);
  };

  const handleSaveRole = (roleData: RoleFormData) => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id ? { ...role, ...roleData } : role
        )
      );
      toast.success('Rol actualizado', {
        description: `El rol ${roleData.name} ha sido actualizado correctamente.`,
      });
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...roleData,
        createdAt: new Date().toISOString().split('T')[0],
        usersCount: 0,
      };
      setRoles((prev) => [newRole, ...prev]);
      toast.success('Rol creado', {
        description: `El rol ${roleData.name} ha sido creado exitosamente.`,
      });
    }
  };

  // === CLIENT HANDLERS ===

  const handleCreateClient = () => {
    setEditingClient(null);
    setIsClientFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleSaveClient = (clientData: ClientFormData) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClient.id ? { ...client, ...clientData } : client
        )
      );
      toast.success('Cliente actualizado', {
        description: `Los datos de ${clientData.name} han sido actualizados correctamente.`,
      });
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [newClient, ...prev]);
      toast.success('Cliente creado', {
        description: `${clientData.name} ha sido agregado al sistema.`,
      });
    }
  };

  const handleConfirmToggleStatusClient = () => {
    if (toggleStatusClient) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === toggleStatusClient.id
            ? { ...client, isActive: !client.isActive }
            : client
        )
      );

      if (toggleStatusClient.isActive) {
        toast.warning('Cliente desactivado', {
          description: `${toggleStatusClient.name} ya no podrá acceder al sistema.`,
        });
      } else {
        toast.success('Cliente activado', {
          description: `${toggleStatusClient.name} ahora puede acceder al sistema.`,
        });
      }

      setToggleStatusClient(null);
    }
  };

  const handleConfirmDeleteClient = () => {
    if (deleteDialogClient) {
      setClients((prev) => prev.filter((client) => client.id !== deleteDialogClient.id));
      toast.success('Cliente eliminado', {
        description: `${deleteDialogClient.name} ha sido eliminado del sistema.`,
      });
      setDeleteDialogClient(null);
    }
  };

  // === PROJECT HANDLERS ===

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = (projectData: ProjectFormData) => {
    const client = clients.find((c) => c.id === projectData.clientId);

    if (editingProject) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                ...projectData,
                clientName: client?.name || editingProject.clientName
              }
            : project
        )
      );
      toast.success('Proyecto actualizado', {
        description: `Los datos de ${projectData.name} han sido actualizados correctamente.`,
      });
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
        clientName: client?.name || '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProjects((prev) => [newProject, ...prev]);
      toast.success('Proyecto creado', {
        description: `${projectData.name} ha sido agregado al sistema.`,
      });
    }
  };

  const handleConfirmToggleStatusProject = () => {
    if (toggleStatusProject) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === toggleStatusProject.id
            ? { ...project, isActive: !project.isActive }
            : project
        )
      );

      if (toggleStatusProject.isActive) {
        toast.warning('Proyecto desactivado', {
          description: `${toggleStatusProject.name} ya no estará activo.`,
        });
      } else {
        toast.success('Proyecto activado', {
          description: `${toggleStatusProject.name} ahora está activo.`,
        });
      }

      setToggleStatusProject(null);
    }
  };

  const handleConfirmDeleteProject = () => {
    if (deleteDialogProject) {
      setProjects((prev) => prev.filter((project) => project.id !== deleteDialogProject.id));
      toast.success('Proyecto eliminado', {
        description: `${deleteDialogProject.name} ha sido eliminado del sistema.`,
      });
      setDeleteDialogProject(null);
    }
  };

  // === TASK HANDLERS ===

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    const project = projects.find((p) => p.id === taskData.projectId);

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...taskData,
                projectName: project?.name || editingTask.projectName
              }
            : task
        )
      );
      toast.success('Tarea actualizada', {
        description: `Los datos de ${taskData.name} han sido actualizados correctamente.`,
      });
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        projectName: project?.name || '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Tarea creada', {
        description: `${taskData.name} ha sido agregado al sistema.`,
      });
    }
  };

  const handleConfirmToggleStatusTask = () => {
    if (toggleStatusTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === toggleStatusTask.id
            ? { ...task, isActive: !task.isActive }
            : task
        )
      );

      if (toggleStatusTask.isActive) {
        toast.warning('Tarea desactivada', {
          description: `${toggleStatusTask.name} ya no estará activa.`,
        });
      } else {
        toast.success('Tarea activada', {
          description: `${toggleStatusTask.name} ahora está activa.`,
        });
      }

      setToggleStatusTask(null);
    }
  };

  const handleConfirmDeleteTask = () => {
    if (deleteDialogTask) {
      setTasks((prev) => prev.filter((task) => task.id !== deleteDialogTask.id));
      toast.success('Tarea eliminada', {
        description: `${deleteDialogTask.name} ha sido eliminado del sistema.`,
      });
      setDeleteDialogTask(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
      </div>

      {/* Mobile Sidebar */}
      <div className="flex-1">
        <MobileSidebar activeView={activeView} onNavigate={setActiveView} />

        {/* Main Content */}
        <main className="w-full px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:max-w-[calc(100vw-16rem)]">
          {activeView === 'users' && (
            <UserList
              users={users}
              onCreateUser={handleCreateUser}
              onEditUser={handleEditUser}
              onToggleStatus={(user) => setToggleStatusUser(user)}
              onDeleteUser={(user) => setDeleteDialogUser(user)}
              searchTerm={userSearchTerm}
              onSearchChange={setUserSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          )}

          {activeView === 'roles' && (
            <RoleList
              roles={roles}
              permissions={allPermissions}
              onCreateRole={handleCreateRole}
              onEditRole={handleEditRole}
              searchTerm={roleSearchTerm}
              onSearchChange={setRoleSearchTerm}
            />
          )}

          {activeView === 'clients' && (
            <ClientList
              clients={clients}
              onCreateClient={handleCreateClient}
              onEditClient={handleEditClient}
              onToggleStatus={(client) => setToggleStatusClient(client)}
              onDeleteClient={(client) => setDeleteDialogClient(client)}
              searchTerm={clientSearchTerm}
              onSearchChange={setClientSearchTerm}
              statusFilter={clientStatusFilter}
              onStatusFilterChange={setClientStatusFilter}
            />
          )}

          {activeView === 'projects' && (
            <ProjectList
              projects={projects}
              onCreateProject={handleCreateProject}
              onEditProject={handleEditProject}
              onDeleteProject={(project) => setDeleteDialogProject(project)}
              searchTerm={projectSearchTerm}
              onSearchChange={setProjectSearchTerm}
            />
          )}

          {activeView === 'tasks' && (
            <TaskList
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onEditTask={handleEditTask}
              onDeleteTask={(task) => setDeleteDialogTask(task)}
              searchTerm={taskSearchTerm}
              onSearchChange={setTaskSearchTerm}
            />
          )}

          {activeView === 'reports' && (
            <ReportView
              clients={clients}
              projects={projects}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              onSave={(newSettings) => {
                setSettings(newSettings);
                toast.success('Configuración guardada', {
                  description: 'Los cambios han sido guardados correctamente.',
                });
              }}
            />
          )}

          {activeView === 'audit' && (
            <AuditLogList logs={auditLogs} />
          )}
        </main>
      </div>

      {/* User Form Dialog */}
      <UserForm
        user={editingUser}
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Role Form Dialog */}
      <RoleForm
        role={editingRole}
        permissions={allPermissions}
        isOpen={isRoleFormOpen}
        onClose={() => {
          setIsRoleFormOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
      />

      {/* Client Form Dialog */}
      <ClientForm
        client={editingClient}
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
      />

      {/* Project Form Dialog */}
      <ProjectForm
        project={editingProject}
        clients={clients}
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />

      {/* Task Form Dialog */}
      <TaskForm
        task={editingTask}
        projects={projects}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog
        open={toggleStatusUser !== null}
        onOpenChange={() => setToggleStatusUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleStatusUser?.isActive ? 'Desactivar usuario' : 'Activar usuario'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusUser?.isActive ? (
                <>
                  ¿Estás seguro que deseas desactivar a <strong>{toggleStatusUser?.name}</strong>?
                  <br />
                  <br />
                  El usuario no podrá acceder al sistema hasta que lo reactives nuevamente.
                </>
              ) : (
                <>
                  ¿Estás seguro que deseas activar a <strong>{toggleStatusUser?.name}</strong>?
                  <br />
                  <br />
                  El usuario podrá acceder al sistema inmediatamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleStatus}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogUser !== null}
        onOpenChange={() => setDeleteDialogUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar a <strong>{deleteDialogUser?.name}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. El usuario perderá acceso permanentemente y todos
              sus datos serán eliminados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog for Clients */}
      <AlertDialog
        open={toggleStatusClient !== null}
        onOpenChange={() => setToggleStatusClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleStatusClient?.isActive ? 'Desactivar cliente' : 'Activar cliente'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusClient?.isActive ? (
                <>
                  ¿Estás seguro que deseas desactivar a <strong>{toggleStatusClient?.name}</strong>?
                  <br />
                  <br />
                  El cliente no podrá acceder al sistema hasta que lo reactives nuevamente.
                </>
              ) : (
                <>
                  ¿Estás seguro que deseas activar a <strong>{toggleStatusClient?.name}</strong>?
                  <br />
                  <br />
                  El cliente podrá acceder al sistema inmediatamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleStatusClient}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Clients */}
      <AlertDialog
        open={deleteDialogClient !== null}
        onOpenChange={() => setDeleteDialogClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar a <strong>{deleteDialogClient?.name}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. El cliente perderá acceso permanentemente y todos
              sus datos serán eliminados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog for Projects */}
      <AlertDialog
        open={toggleStatusProject !== null}
        onOpenChange={() => setToggleStatusProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleStatusProject?.isActive ? 'Desactivar proyecto' : 'Activar proyecto'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusProject?.isActive ? (
                <>
                  ¿Estás seguro que deseas desactivar a <strong>{toggleStatusProject?.name}</strong>?
                  <br />
                  <br />
                  El proyecto no estará activo hasta que lo reactives nuevamente.
                </>
              ) : (
                <>
                  ¿Estás seguro que deseas activar a <strong>{toggleStatusProject?.name}</strong>?
                  <br />
                  <br />
                  El proyecto estará activo inmediatamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleStatusProject}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Projects */}
      <AlertDialog
        open={deleteDialogProject !== null}
        onOpenChange={() => setDeleteDialogProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar proyecto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar a <strong>{deleteDialogProject?.name}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. El proyecto perderá acceso permanentemente y todos
              sus datos serán eliminados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog for Tasks */}
      <AlertDialog
        open={toggleStatusTask !== null}
        onOpenChange={() => setToggleStatusTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleStatusTask?.isActive ? 'Desactivar tarea' : 'Activar tarea'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusTask?.isActive ? (
                <>
                  ¿Estás seguro que deseas desactivar a <strong>{toggleStatusTask?.name}</strong>?
                  <br />
                  <br />
                  La tarea no estará activa hasta que lo reactives nuevamente.
                </>
              ) : (
                <>
                  ¿Estás seguro que deseas activar a <strong>{toggleStatusTask?.name}</strong>?
                  <br />
                  <br />
                  La tarea estará activa inmediatamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleStatusTask}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Tasks */}
      <AlertDialog
        open={deleteDialogTask !== null}
        onOpenChange={() => setDeleteDialogTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar a <strong>{deleteDialogTask?.name}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. La tarea perderá acceso permanentemente y todos
              sus datos serán eliminados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
