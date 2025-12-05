import apiClient, { getAxiosConfig } from './apiClient';
import type { Category } from '../types/types';

const API_URL = '/categories';

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get(`${API_URL}`, getAxiosConfig());
  return res.data;
};

export const getCategoriesByUser = async (userId: number): Promise<Category[]> => {
  const res = await apiClient.get(`${API_URL}/user/${userId}`, getAxiosConfig());
  return res.data;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const res = await apiClient.post(`${API_URL}/new-category`, category, getAxiosConfig());
  return res.data;
};

export const deleteCategory = async (id: number) => {
  return apiClient.delete(`${API_URL}/delete/${id}`, getAxiosConfig());
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const res = await apiClient.put(`${API_URL}/update/${id}`, category, getAxiosConfig());
  return res.data;
};
