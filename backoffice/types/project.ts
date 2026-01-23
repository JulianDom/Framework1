export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'paused' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  responsiblePerson: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  clientId: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  responsiblePerson: string;
  isActive: boolean;
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: 'Planificación',
  'in-progress': 'En Progreso',
  completed: 'Completado',
  paused: 'Pausado',
  cancelled: 'Cancelado',
};

export const projectStatusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  planning: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'in-progress': { bg: 'bg-green-100', text: 'text-green-800' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-800' },
  paused: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};
