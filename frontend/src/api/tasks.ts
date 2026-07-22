import api from './axios';
import type { Task, DashboardStats, TaskFormData } from '../types';

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
}

export const getTasks = async (filters: TaskFilters = {}): Promise<Task[]> => {
  const response = await api.get('/tasks', { params: filters });
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: TaskFormData): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data.data;
};

export const updateTask = async (id: string, data: TaskFormData): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/tasks/stats/dashboard');
  return response.data.data;
};