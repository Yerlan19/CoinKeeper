import apiClient, { setAuthToken, getAxiosConfig } from './apiClient';
import type { User } from '../types/types';

const API_URL = '/users';


export interface AuthResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse | ErrorResponse> => {
  try {
    // Регистрация не требует токена
    const response = await apiClient.post<AuthResponse>(`${API_URL}/register`, {
      name,
      email,
      username: email,
      password,
    });
    // Сохраняем токен после успешной регистрации
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data as ErrorResponse;
    }
    return { message: 'An unexpected error occurred' };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse | ErrorResponse> => {
  try {
    // Логин не требует токена
    const response = await apiClient.post<AuthResponse>(`${API_URL}/login`, {
      email,
      username: email,
      password,
    });
    // Сохраняем токен после успешного логина
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data as ErrorResponse;
    }
    return { message: 'An unexpected error occurred' };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Используем getAxiosConfig для автоматического добавления токена
    const response = await apiClient.get<{ id: number; name: string; email: string }>(`${API_URL}/me`, getAxiosConfig());
    // Преобразуем ответ в формат User
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email
    };
  } catch (error) {
    console.error('Failed to fetch current user', error);
    return null;
  }
};

// Экспортируем setAuthToken из apiClient для совместимости
export { setAuthToken };