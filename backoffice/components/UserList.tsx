import { Users, Search, Plus, Edit, Trash2, UserX, UserCheck, ArrowUpDown, Download } from 'lucide-react';
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
import { User } from '../types/user';
import { Pagination } from './Pagination';

interface UserListProps {
  users: User[];
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDeleteUser: (user: User) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
}

type SortField = 'name' | 'email' | 'role';
type SortOrder = 'asc' | 'desc';

export function UserList({
  users,
  onCreateUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: UserListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'role') {
      comparison = a.role.localeCompare(b.role);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Nombre,Usuario,Correo,Rol,Estado'];
    const rows = sortedUsers.map(user => 
      `${user.name},${user.username},${user.email},${user.role},${user.isActive ? 'Activo' : 'Inactivo'}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Users className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Usuarios</h3>
            <p className="text-muted-foreground text-sm">
              Administra el acceso del personal operativo
            </p>
          </div>
        </div>
        <Button onClick={onCreateUser} className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo"
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
                    Usuario
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Correo electrónico
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Rol
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <UserX className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No se encontraron usuarios
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-muted-foreground text-sm">{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{user.email}</TableCell>
                    <TableCell className="text-foreground">{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? 'default' : 'secondary'}
                        className={
                          user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }
                      >
                        {user.isActive ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Activo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <UserX className="h-3 w-3" />
                            Inactivo
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUser(user)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden md:inline">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(user)}
                          className="gap-1"
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="h-4 w-4" />
                              <span className="hidden md:inline">Desactivar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              <span className="hidden md:inline">Activar</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteUser(user)}
                          className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden md:inline">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {sortedUsers.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedUsers.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}