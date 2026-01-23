'use client';

import { Users, Shield, Briefcase, FolderKanban, CheckSquare, BarChart3, Settings, FileText, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type NavigationView = 'users' | 'roles' | 'clients' | 'projects' | 'tasks' | 'reports' | 'settings' | 'audit';

interface SidebarProps {
  activeView: NavigationView;
  onNavigate: (view: NavigationView) => void;
}

interface NavigationItem {
  id: NavigationView;
  label: string;
  icon: React.ReactNode;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: 'Administración',
    items: [
      {
        id: 'users',
        label: 'Gestión de Usuarios',
        icon: <Users className="h-5 w-5" />,
      },
      {
        id: 'roles',
        label: 'Gestión de Roles',
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Proyectos',
    items: [
      {
        id: 'clients',
        label: 'Gestión de Clientes',
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        id: 'projects',
        label: 'Gestión de Proyectos',
        icon: <FolderKanban className="h-5 w-5" />,
      },
      {
        id: 'tasks',
        label: 'Gestión de Tareas',
        icon: <CheckSquare className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        id: 'reports',
        label: 'Reportes',
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: <Settings className="h-5 w-5" />,
      },
      {
        id: 'audit',
        label: 'Auditoría',
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional como limpiar el localStorage, cookies, etc.
    router.push('/login');
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h2 className="font-semibold text-foreground">Panel Administrativo</h2>
      </div>

      <nav className="flex-1 space-y-6 p-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    activeView === item.id
                      ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                      : 'text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {activeView === item.id && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4 space-y-3">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </aside>
  );
}