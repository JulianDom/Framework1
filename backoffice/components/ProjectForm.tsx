import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
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
import { Project, ProjectFormData, ProjectStatus, projectStatusLabels } from '../types/project';
import { Client } from '../types/client';

interface ProjectFormProps {
  project: Project | null;
  clients: Client[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
}

export function ProjectForm({ project, clients, isOpen, onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    clientId: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: 0,
    responsiblePerson: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget,
        responsiblePerson: project.responsiblePerson,
        isActive: project.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        clientId: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: 0,
        responsiblePerson: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Debes seleccionar un cliente';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'El presupuesto debe ser mayor a 0';
    }

    if (!formData.responsiblePerson.trim()) {
      newErrors.responsiblePerson = 'El responsable es requerido';
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

  const handleChange = (field: keyof ProjectFormData, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const activeClients = clients.filter((client) => client.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
          <DialogDescription>
            {project
              ? 'Modifica los datos del proyecto existente'
              : 'Completa los datos para crear un nuevo proyecto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Información General</h4>

            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.name}
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Cliente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleChange('clientId', value)}
                >
                  <SelectTrigger
                    id="clientId"
                    className={errors.clientId ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeClients.length === 0 ? (
                      <div className="px-2 py-6 text-center text-muted-foreground text-sm">
                        No hay clientes activos disponibles
                      </div>
                    ) : (
                      activeClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.clientId && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.clientId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value as ProjectStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">{projectStatusLabels.planning}</SelectItem>
                    <SelectItem value="in-progress">{projectStatusLabels['in-progress']}</SelectItem>
                    <SelectItem value="completed">{projectStatusLabels.completed}</SelectItem>
                    <SelectItem value="paused">{projectStatusLabels.paused}</SelectItem>
                    <SelectItem value="cancelled">{projectStatusLabels.cancelled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cronograma y Presupuesto */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Cronograma y Presupuesto</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Fecha de Inicio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-destructive' : ''}
                />
                {errors.startDate && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Fecha de Fin <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className={errors.endDate ? 'border-destructive' : ''}
                />
                {errors.endDate && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                Presupuesto (ARS) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="1"
                value={formData.budget || ''}
                onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
                className={errors.budget ? 'border-destructive' : ''}
              />
              {errors.budget && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.budget}
                </p>
              )}
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Responsable</h4>

            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">
                Nombre del Responsable <span className="text-destructive">*</span>
              </Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => handleChange('responsiblePerson', e.target.value)}
                className={errors.responsiblePerson ? 'border-destructive' : ''}
              />
              {errors.responsiblePerson && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.responsiblePerson}
                </p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Proyecto Activo
              </Label>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                {formData.isActive
                  ? 'El proyecto está habilitado en el sistema'
                  : 'El proyecto está deshabilitado en el sistema'}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="w-full md:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full md:w-auto">
              {project ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}