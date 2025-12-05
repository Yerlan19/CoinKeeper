import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, loading, token } = useAppSelector((state) => state.auth);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Запрашиваем данные пользователя, если есть токен, но user ещё не загружен
    if (token && !user && !loading) {
      const fetchUser = async () => {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // Ошибка уже обработана в slice
        }
      };
      fetchUser();
    }
  }, [dispatch, token, user, loading]);

  // Таймаут для загрузки (если загрузка длится больше 10 секунд)
  useEffect(() => {
    if (token && !user && loading) {
      timeoutRef.current = setTimeout(() => {
        console.warn('Loading timeout - redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 10000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [token, user, loading]);

  // Пока идёт загрузка пользователя при наличии токена
  if (token && !user && loading) {
    return <LoadingScreen />;
  }

  // Если нет токена или пользователь не найден после загрузки
  if (!token || (!user && !loading)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
