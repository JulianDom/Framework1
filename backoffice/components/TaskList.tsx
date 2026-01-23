import { CheckSquare, Search, Plus, Edit, Trash2, ArrowUpDown, Download } from 'lucide-react';
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
import { Task, TaskStatus, taskStatusLabels, taskStatusColors, taskPriorityLabels, taskPriorityColors } from '../types/task';
import { Pagination } from './Pagination';

interface TaskListProps {
  tasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

type SortField = 'title' | 'projectName' | 'dueDate' | 'priority';
type SortOrder = 'asc' | 'desc';

export function TaskList({
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  searchTerm,
  onSearchChange,
}: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'projectName') {
      comparison = a.projectName.localeCompare(b.projectName);
    } else if (sortField === 'dueDate') {
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortField === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleExportCSV = () => {
    const headers = ['Tarea,Proyecto,Estado,Prioridad,Fecha Vencimiento,Asignado a'];
    const rows = sortedTasks.map(task =>
      `"${task.title}","${task.projectName}",${taskStatusLabels[task.status]},${taskPriorityLabels[task.priority]},${task.dueDate},"${task.assignedTo}"`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tareas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Gestión de Tareas</h3>
            <p className="text-muted-foreground text-sm">
              Organiza tareas asociadas a proyectos
            </p>
          </div>
        </div>
        <Button onClick={onCreateTask} className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por tarea, proyecto o asignado"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="secondary" 
          onClick={handleExportCSV}
          className="w-full md:w-auto gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="lg:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Tarea
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('projectName')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Proyecto
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => {
                      setStatusFilter(value as TaskStatus | 'all');
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full border-0 shadow-none hover:bg-muted/50 focus:ring-0 h-auto p-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Curso</SelectItem>
                      <SelectItem value="completed">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('priority')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Prioridad
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('dueDate')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Vencimiento
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckSquare className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No se encontraron tareas
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{task.title}</div>
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{task.projectName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${taskStatusColors[task.status].bg} ${taskStatusColors[task.status].text} hover:${taskStatusColors[task.status].bg}`}
                      >
                        {taskStatusLabels[task.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${taskPriorityColors[task.priority].bg} ${taskPriorityColors[task.priority].text} hover:${taskPriorityColors[task.priority].bg}`}
                      >
                        {taskPriorityLabels[task.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{formatDate(task.dueDate)}</TableCell>
                    <TableCell className="text-foreground">{task.assignedTo}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTask(task)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden lg:inline">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteTask(task)}
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
        {sortedTasks.length > 0 && (
          <div className="border-t border-border px-4 md:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedTasks.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
