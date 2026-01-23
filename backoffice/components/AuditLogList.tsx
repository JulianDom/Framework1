import { FileText, Search, Filter, Calendar, ChevronUp, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AuditLog,
  AuditActionType,
  AuditModule,
  auditActionLabels,
  auditActionColors,
  auditModuleLabels,
} from '../types/audit';
import { Pagination } from './Pagination';

interface AuditLogListProps {
  logs: AuditLog[];
}

export function AuditLogList({ logs }: AuditLogListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState<AuditActionType | 'all'>('all');
  const [moduleFilter, setModuleFilter] = useState<AuditModule | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

    const logDate = new Date(log.timestamp);
    const matchesStartDate = !startDate || logDate >= new Date(startDate);
    const matchesEndDate = !endDate || logDate <= new Date(endDate + 'T23:59:59');

    return matchesSearch && matchesAction && matchesModule && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleClearFilters = () => {
    setActionFilter('all');
    setModuleFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Auditoría y Logs</h3>
            <p className="text-muted-foreground text-sm">
              Consulta acciones relevantes del sistema
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

      {/* Search */}
      <div className="relative w-full md:w-[400px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por usuario o descripción"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros de Búsqueda
              </h4>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="actionFilter">Tipo de Acción</Label>
                <Select
                  value={actionFilter}
                  onValueChange={(value) => {
                    setActionFilter(value as AuditActionType | 'all');
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="actionFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las acciones</SelectItem>
                    <SelectItem value="login">Inicio de sesión</SelectItem>
                    <SelectItem value="logout">Cierre de sesión</SelectItem>
                    <SelectItem value="create">Crear</SelectItem>
                    <SelectItem value="update">Actualizar</SelectItem>
                    <SelectItem value="delete">Eliminar</SelectItem>
                    <SelectItem value="view">Ver</SelectItem>
                    <SelectItem value="export">Exportar</SelectItem>
                    <SelectItem value="config_change">Cambio de configuración</SelectItem>
                    <SelectItem value="status_change">Cambio de estado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleFilter">Módulo</Label>
                <Select
                  value={moduleFilter}
                  onValueChange={(value) => {
                    setModuleFilter(value as AuditModule | 'all');
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="moduleFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los módulos</SelectItem>
                    <SelectItem value="users">Usuarios</SelectItem>
                    <SelectItem value="roles">Roles</SelectItem>
                    <SelectItem value="clients">Clientes</SelectItem>
                    <SelectItem value="projects">Proyectos</SelectItem>
                    <SelectItem value="tasks">Tareas</SelectItem>
                    <SelectItem value="reports">Reportes</SelectItem>
                    <SelectItem value="settings">Configuración</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha Desde</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha Hasta</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          Mostrando {paginatedLogs.length} de {filteredLogs.length} registros
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="lg:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {filteredLogs.length === 0 && logs.length > 0
                          ? 'No se encontraron registros con los filtros aplicados'
                          : 'No hay registros de auditoría disponibles'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="text-foreground font-mono text-sm">
                        {formatDateTime(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-foreground">{log.userName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${auditActionColors[log.action].bg} ${auditActionColors[log.action].text} hover:${auditActionColors[log.action].bg}`}
                        >
                          {auditActionLabels[log.action]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {auditModuleLabels[log.module]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground max-w-md">
                        <div className="truncate">{log.description}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedLog(selectedLog?.id === log.id ? null : log)
                          }
                          className="gap-1"
                        >
                          {selectedLog?.id === log.id ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              <span className="hidden lg:inline">Ocultar</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              <span className="hidden lg:inline">Ver Detalle</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Detail Row */}
                    {selectedLog?.id === log.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30">
                          <Card className="p-4 md:p-6">
                            <div className="space-y-4">
                              <h4 className="font-medium text-foreground">
                                Detalle del Evento
                              </h4>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-sm">ID del Evento</p>
                                  <p className="text-foreground font-mono text-sm">{log.id}</p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-sm">Fecha y Hora</p>
                                  <p className="text-foreground font-mono text-sm">
                                    {formatDateTime(log.timestamp)}
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-sm">Usuario</p>
                                  <p className="text-foreground">{log.userName}</p>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-muted-foreground text-sm">ID de Usuario</p>
                                  <p className="text-foreground font-mono text-sm">{log.userId}</p>
                                </div>

                                {log.ipAddress && (
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm">Dirección IP</p>
                                    <p className="text-foreground font-mono text-sm">
                                      {log.ipAddress}
                                    </p>
                                  </div>
                                )}

                                {log.userAgent && (
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm">Navegador</p>
                                    <p className="text-foreground text-sm line-clamp-2">
                                      {log.userAgent}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Descripción</p>
                                <p className="text-foreground">{log.description}</p>
                              </div>

                              {log.details && Object.keys(log.details).length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-muted-foreground text-sm">
                                    Información Adicional
                                  </p>
                                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                                    <pre className="text-sm text-foreground overflow-x-auto">
                                      {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredLogs.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
