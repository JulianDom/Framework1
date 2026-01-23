import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Task, TaskFormData, TaskStatus, TaskPriority, taskStatusLabels, taskPriorityLabels } from '../types/task';
import { Project } from '../types/project';

interface TaskFormProps {
  task: Task | null;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
}

export function TaskForm({ task, projects, isOpen, onClose, onSave }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Debes seleccionar un proyecto';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Debes asignar la tarea a alguien';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const activeProjects = projects.filter((project) => project.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Modifica los datos de la tarea existente'
              : 'Completa los datos para crear una nueva tarea'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Información General</h4>

            <div className="space-y-2">
              <Label htmlFor="title">
                Título de la Tarea <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">
                Proyecto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleChange('projectId', value)}
              >
                <SelectTrigger
                  id="projectId"
                  className={errors.projectId ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {activeProjects.length === 0 ? (
                    <div className="px-2 py-6 text-center text-muted-foreground text-sm">
                      No hay proyectos activos disponibles
                    </div>
                  ) : (
                    activeProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} - {project.clientName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.projectId}
                </p>
              )}
            </div>
          </div>

          {/* Estado y Prioridad */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Estado y Prioridad</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value as TaskStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{taskStatusLabels.pending}</SelectItem>
                    <SelectItem value="in-progress">{taskStatusLabels['in-progress']}</SelectItem>
                    <SelectItem value="completed">{taskStatusLabels.completed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Prioridad <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange('priority', value as TaskPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{taskPriorityLabels.low}</SelectItem>
                    <SelectItem value="medium">{taskPriorityLabels.medium}</SelectItem>
                    <SelectItem value="high">{taskPriorityLabels.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Asignación */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Asignación</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">
                  Asignado a <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  className={errors.assignedTo ? 'border-destructive' : ''}
                />
                {errors.assignedTo && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.assignedTo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Fecha de Vencimiento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className={errors.dueDate ? 'border-destructive' : ''}
                />
                {errors.dueDate && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.dueDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="w-full md:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full md:w-auto">
              {task ? 'Guardar Cambios' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}