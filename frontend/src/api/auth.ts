import api from './axios';
import type { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return { token: response.data.token, user: response.data.user };
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};