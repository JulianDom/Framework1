import { BarChart3, Filter, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ReportType, ReportPeriod, ReportFilter, reportTypeLabels, reportPeriodLabels } from '../types/report';
import { Client } from '../types/client';
import { Project } from '../types/project';

interface ReportViewProps {
  clients: Client[];
  projects: Project[];
}

export function ReportView({ clients, projects }: ReportViewProps) {
  const [filters, setFilters] = useState<ReportFilter>({
    type: 'projects',
    period: 'month',
    startDate: '',
    endDate: '',
    clientId: '',
    projectId: '',
    status: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field: keyof ReportFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Mock metrics based on filter type
  const getMetrics = () => {
    switch (filters.type) {
      case 'projects':
        return [
          { label: 'Total de Proyectos', value: projects.length, change: 12, trend: 'up' as const },
          { label: 'Proyectos Activos', value: projects.filter(p => p.isActive).length, change: 5, trend: 'up' as const },
          { label: 'Presupuesto Total', value: `$${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}`, change: 8, trend: 'up' as const },
          { label: 'En Progreso', value: projects.filter(p => p.status === 'in-progress').length, change: 0, trend: 'stable' as const },
        ];
      case 'tasks':
        return [
          { label: 'Total de Tareas', value: 156, change: 23, trend: 'up' as const },
          { label: 'Tareas Pendientes', value: 45, change: -8, trend: 'down' as const },
          { label: 'En Curso', value: 67, change: 15, trend: 'up' as const },
          { label: 'Finalizadas', value: 44, change: 16, trend: 'up' as const },
        ];
      case 'clients':
        return [
          { label: 'Total de Clientes', value: clients.length, change: 3, trend: 'up' as const },
          { label: 'Clientes Activos', value: clients.filter(c => c.isActive).length, change: 2, trend: 'up' as const },
          { label: 'Nuevos este mes', value: 2, change: 100, trend: 'up' as const },
          { label: 'Proyectos promedio', value: '2.4', change: 0, trend: 'stable' as const },
        ];
      case 'users':
        return [
          { label: 'Total de Usuarios', value: 24, change: 4, trend: 'up' as const },
          { label: 'Usuarios Activos', value: 21, change: 5, trend: 'up' as const },
          { label: 'Nuevos este mes', value: 3, change: 50, trend: 'up' as const },
          { label: 'Tasa de actividad', value: '87.5%', change: 3, trend: 'up' as const },
        ];
      default:
        return [];
    }
  };

  const metrics = getMetrics();

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Reportes</h3>
            <p className="text-muted-foreground text-sm">
              Visualiza información consolidada del sistema
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowFilters(!showFilters)} 
          variant="default"
          className="w-full md:w-auto gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 md:p-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros de Búsqueda
            </h4>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="reportType">Tipo de Reporte</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange('type', value as ReportType)}
                >
                  <SelectTrigger id="reportType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="projects">{reportTypeLabels.projects}</SelectItem>
                    <SelectItem value="tasks">{reportTypeLabels.tasks}</SelectItem>
                    <SelectItem value="clients">{reportTypeLabels.clients}</SelectItem>
                    <SelectItem value="users">{reportTypeLabels.users}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={filters.period}
                  onValueChange={(value) => handleFilterChange('period', value as ReportPeriod)}
                >
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">{reportPeriodLabels.week}</SelectItem>
                    <SelectItem value="month">{reportPeriodLabels.month}</SelectItem>
                    <SelectItem value="quarter">{reportPeriodLabels.quarter}</SelectItem>
                    <SelectItem value="year">{reportPeriodLabels.year}</SelectItem>
                    <SelectItem value="custom">{reportPeriodLabels.custom}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filters.type === 'projects' && (
                <div className="space-y-2">
                  <Label htmlFor="clientFilter">Cliente</Label>
                  <Select
                    value={filters.clientId || 'all'}
                    onValueChange={(value) => handleFilterChange('clientId', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger id="clientFilter">
                      <SelectValue placeholder="Todos los clientes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {filters.period === 'custom' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Report Header */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          Reporte de {reportTypeLabels[filters.type]} - {reportPeriodLabels[filters.period]}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4 md:p-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">{metric.label}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                  {metric.value}
                </p>
                {metric.change !== undefined && (
                  <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    <span className="text-sm font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State / Chart Placeholder */}
      <Card className="p-8 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Visualización de Datos</h4>
            <p className="text-muted-foreground text-sm max-w-md">
              Los gráficos y datos detallados se mostrarán aquí según los filtros aplicados.
              Esta es una vista de prototipo funcional.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}