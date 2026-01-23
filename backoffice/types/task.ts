export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Curso',
  completed: 'Finalizada',
};

export const taskStatusColors: Record<TaskStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const taskPriorityColors: Record<TaskPriority, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-800' },
  medium: { bg: 'bg-orange-100', text: 'text-orange-800' },
  high: { bg: 'bg-red-100', text: 'text-red-800' },
};
