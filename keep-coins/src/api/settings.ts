import apiClient, { getAxiosConfig } from './apiClient';
import type { UserSettings } from '../types/types';

const API_URL = '/settings';
const USERS_API_URL = '/users';

export const getUserSettings = async (userId: number): Promise<UserSettings> => {
  const res = await apiClient.get(`${API_URL}/user/${userId}`, getAxiosConfig());
  return res.data;
};

export const updateUserSettings = async (
  userId: number, 
  settings: Partial<UserSettings>
): Promise<UserSettings> => {
  const res = await apiClient.put(`${API_URL}/update/${userId}`, settings, getAxiosConfig());
  return res.data;
};

export const verifyPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await apiClient.post(`${USERS_API_URL}/verify-password`, { email, password }, getAxiosConfig());
    return res.data.valid;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

// Default settings can be used as fallback
export const defaultSettings: UserSettings = {
  user_id: -1,
  name: '',
  email: '',
  currency: 'KZT',
  language: 'en',
  theme: 'dark',
};
