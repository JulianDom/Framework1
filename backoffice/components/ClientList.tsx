import { Briefcase, Search, Plus, Edit, Trash2, UserX, UserCheck, ArrowUpDown, Download } from 'lucide-react';
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
import { Client } from '../types/client';
import { Pagination } from './Pagination';

interface ClientListProps {
  clients: Client[];
  onCreateClient: () => void;
  onEditClient: (client: Client) => void;
  onToggleStatus: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
}

type SortField = 'name' | 'businessName' | 'city';
type SortOrder = 'asc' | 'desc';

export function ClientList({
  clients,
  onCreateClient,
  onEditClient,
  onToggleStatus,
  onDeleteClient,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ClientListProps) {
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

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cuit.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && client.isActive) ||
      (statusFilter === 'inactive' && !client.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'businessName') {
      comparison = a.businessName.localeCompare(b.businessName);
    } else if (sortField === 'city') {
      comparison = a.city.localeCompare(b.city);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Nombre,Razón Social,CUIT,Email,Teléfono,Ciudad,País,Persona de Contacto,Estado'];
    const rows = sortedClients.map(client =>
      `${client.name},"${client.businessName}",${client.cuit},${client.email},${client.phone},${client.city},${client.country},${client.contactPerson},${client.isActive ? 'Activo' : 'Inactivo'}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Clientes</h3>
            <p className="text-muted-foreground text-sm">
              Administra la información de tus clientes
            </p>
          </div>
        </div>
        <Button onClick={onCreateClient} className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, correo o CUIT"
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
                    Nombre
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('businessName')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Razón Social
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>CUIT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('city')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Ciudad
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
              {paginatedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No se encontraron clientes
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{client.name}</div>
                    </TableCell>
                    <TableCell className="text-foreground">{client.businessName}</TableCell>
                    <TableCell className="text-foreground">{client.cuit}</TableCell>
                    <TableCell className="text-foreground">{client.email}</TableCell>
                    <TableCell className="text-foreground">{client.city}</TableCell>
                    <TableCell>
                      <Badge
                        variant={client.isActive ? 'default' : 'secondary'}
                        className={
                          client.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }
                      >
                        {client.isActive ? (
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
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditClient(client)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden lg:inline">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(client)}
                          className="gap-1"
                        >
                          {client.isActive ? (
                            <>
                              <UserX className="h-4 w-4" />
                              <span className="hidden lg:inline">Desactivar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              <span className="hidden lg:inline">Activar</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClient(client)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden lg:inline">Eliminar</span>
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
        {sortedClients.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedClients.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}