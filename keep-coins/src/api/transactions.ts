import apiClient, { getAxiosConfig } from './apiClient';
import type { Transaction } from '../types/types';

const API_URL = '/transactions';

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const res = await apiClient.get(`${API_URL}`, getAxiosConfig());
  return res.data;
};

export const getTransactionsByUser = async (userId: number): Promise<Transaction[]> => {
  const res = await apiClient.get(`${API_URL}/user/${userId}`, getAxiosConfig());
  return res.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const res = await apiClient.get(`${API_URL}/${id}`, getAxiosConfig());
  return res.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const res = await apiClient.post(`${API_URL}/new-transaction`, transaction, getAxiosConfig());
  return res.data;
};

export const deleteTransaction = async (id: number) => {
  return apiClient.delete(`${API_URL}/delete/${id}`, getAxiosConfig());
};

export const updateTransaction = async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
  const res = await apiClient.put(`${API_URL}/update/${id}`, transaction, getAxiosConfig());
  return res.data;
};
