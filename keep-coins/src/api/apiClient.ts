import axios, { AxiosRequestConfig } from 'axios';

// Базовый URL API из переменных окружения
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получает токен из localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Создает конфигурацию для Axios запросов с токеном авторизации
 * Это централизованная функция для избежания дублирования кода
 */
export const getAxiosConfig = (): AxiosRequestConfig => {
  const token = getToken();
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

/**
 * Устанавливает токен в заголовки по умолчанию для всех запросов
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Инициализация токена при загрузке модуля
const token = getToken();
if (token) {
  setAuthToken(token);
}

// Интерцептор для автоматического добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок авторизации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен недействителен или отсутствует
      setAuthToken(null);
      // Можно перенаправить на страницу логина
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

