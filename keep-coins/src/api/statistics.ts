import apiClient, { getAxiosConfig } from './apiClient';
import type { 
  UserStatistics, 
  CategoryStatistics,
  CombinedCategoryStatistics,
  MonthlyStatistics,
  UserCategoriesStatsRequest,
  UserCategoriesStatsResponse
} from '../types/types';

const API_URL = '/statistics';

// Получение статистики пользователя
export const getUserStatistics = async (userId: number): Promise<UserStatistics> => {
  const res = await apiClient.get(`${API_URL}/user/${userId}`, getAxiosConfig());
  return res.data;
};

// Получение статистики по категории/ям (GET версия)
export const getCategoryStatistics = async (
  categoryIds: number | number[]
): Promise<CombinedCategoryStatistics> => {
  const ids = Array.isArray(categoryIds) 
    ? categoryIds.join(',') 
    : categoryIds.toString();
  
  const res = await apiClient.get(`${API_URL}/category/${ids}`, getAxiosConfig());
  return res.data;
};

// Получение статистики по категориям пользователя (POST версия)
export const getUserCategoriesStatistics = async (
  request: UserCategoriesStatsRequest
): Promise<UserCategoriesStatsResponse> => {
  const res = await apiClient.post(`${API_URL}/user/categories`, request, getAxiosConfig());
  return res.data;
};

// Получение статистики пользователя по месяцам
export const getUserMonthlyStatistics = async (
  userId: number
): Promise<MonthlyStatistics> => {
  const res = await apiClient.get(`${API_URL}/user/${userId}/transactions-by-month`, getAxiosConfig());
  return res.data;
};

// Вспомогательный метод для получения статистики по всем категориям пользователя (GET версия)
export const getUserCategoryStatistics = async (
  userId: number
): Promise<CategoryStatistics[]> => {
  const userStats = await getUserStatistics(userId);
  const categoryIds = userStats.category_stats.map(c => c.category_id);
  
  if (categoryIds.length === 0) return [];
  
  const detailedStats = await getCategoryStatistics(categoryIds);
  return detailedStats.categories;
};

// Вспомогательный метод для получения статистики по всем категориям пользователя (POST версия)
export const getUserCategoryStatisticsPost = async (
  userId: number
): Promise<CategoryStatistics[]> => {
  // Сначала получаем ID всех категорий пользователя
  const userStats = await getUserStatistics(userId);
  const categoryIds = userStats.category_stats.map(c => c.category_id);
  
  if (categoryIds.length === 0) return [];
  
  // Затем получаем детальную статистику через POST
  const detailedStats = await getUserCategoriesStatistics({
    userId,
    categoryIds
  });
  
  return detailedStats.categories;
};