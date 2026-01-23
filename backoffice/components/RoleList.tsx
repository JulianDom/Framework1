import { Shield, Search, Plus, Edit, Users, CheckCircle, XCircle, ArrowUpDown, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Role, Permission } from '../types/role';
import { Pagination } from './Pagination';

interface RoleListProps {
  roles: Role[];
  permissions: Permission[];
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

type SortField = 'name' | 'usersCount';
type SortOrder = 'asc' | 'desc';

export function RoleList({
  roles,
  permissions,
  onCreateRole,
  onEditRole,
  searchTerm,
  onSearchChange,
}: RoleListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && role.isActive) ||
      (statusFilter === 'inactive' && !role.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort roles
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'usersCount') {
      comparison = a.usersCount - b.usersCount;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = sortedRoles.slice(startIndex, startIndex + itemsPerPage);

  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds
      .map((id) => permissions.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
  };

  const handleExportCSV = () => {
    const headers = ['Nombre,Descripción,Cantidad de Permisos,Usuarios,Estado'];
    const rows = sortedRoles.map(role => 
      `${role.name},"${role.description}",${role.permissions.length},${role.usersCount},${role.isActive ? 'Activo' : 'Inactivo'}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Roles</h3>
            <p className="text-muted-foreground text-sm">
              Define roles y asigna permisos específicos
            </p>
          </div>
        </div>
        <Button onClick={onCreateRole} className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-[rgb(0,0,0)]"
          />
        </div>
        {/* <Button 
          variant="secondary" 
          onClick={handleExportCSV}
          className="w-full md:w-auto gap-2"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button> */}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="lg:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Nombre del rol
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('usersCount')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Usuarios
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value as 'all' | 'active' | 'inactive');
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full border-0 shadow-none hover:bg-muted/50 focus:ring-0 h-auto p-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No se encontraron roles
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => {
                  const permissionNames = getPermissionNames(role.permissions);
                  const remainingCount = role.permissions.length - permissionNames.length;

                  return (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{role.name}</div>
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {permissionNames.map((name, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                          {remainingCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              +{remainingCount} más
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-foreground">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {role.usersCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={role.isActive ? 'default' : 'secondary'}
                          className={
                            role.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {role.isActive ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Activo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Inactivo
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRole(role)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden md:inline">Editar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {sortedRoles.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedRoles.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}