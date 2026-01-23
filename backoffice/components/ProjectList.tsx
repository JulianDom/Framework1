import { FolderKanban, Search, Plus, Edit, Trash2, ArrowUpDown, Download } from 'lucide-react';
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
import { Project, ProjectStatus, projectStatusLabels, projectStatusColors } from '../types/project';
import { Pagination } from './Pagination';

interface ProjectListProps {
  projects: Project[];
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

type SortField = 'name' | 'clientName' | 'startDate' | 'budget';
type SortOrder = 'asc' | 'desc';

export function ProjectList({
  projects,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  searchTerm,
  onSearchChange,
}: ProjectListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'clientName') {
      comparison = a.clientName.localeCompare(b.clientName);
    } else if (sortField === 'startDate') {
      comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortField === 'budget') {
      comparison = a.budget - b.budget;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleExportCSV = () => {
    const headers = ['Nombre,Cliente,Estado,Fecha Inicio,Fecha Fin,Presupuesto,Responsable'];
    const rows = sortedProjects.map(project =>
      `"${project.name}","${project.clientName}",${projectStatusLabels[project.status]},${project.startDate},${project.endDate},${project.budget},"${project.responsiblePerson}"`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proyectos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FolderKanban className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Proyectos</h3>
            <p className="text-muted-foreground text-sm">
              Organiza proyectos asociados a clientes
            </p>
          </div>
        </div>
        <Button onClick={onCreateProject} className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, cliente o responsable"
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
                    Proyecto
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('clientName')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Cliente
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => {
                      setStatusFilter(value as ProjectStatus | 'all');
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full border-0 shadow-none hover:bg-muted/50 focus:ring-0 h-auto p-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="planning">Planificación</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="paused">Pausado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('startDate')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Fecha Inicio
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('budget')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Presupuesto
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FolderKanban className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No se encontraron proyectos
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{project.name}</div>
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{project.clientName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${projectStatusColors[project.status].bg} ${projectStatusColors[project.status].text} hover:${projectStatusColors[project.status].bg}`}
                      >
                        {projectStatusLabels[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{formatDate(project.startDate)}</TableCell>
                    <TableCell className="text-foreground font-medium">
                      {formatCurrency(project.budget)}
                    </TableCell>
                    <TableCell className="text-foreground">{project.responsiblePerson}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProject(project)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden lg:inline">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProject(project)}
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
        {sortedProjects.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedProjects.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}