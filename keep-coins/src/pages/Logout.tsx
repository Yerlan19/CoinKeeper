import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/reduxHooks';
import { logout } from '../redux/slices/authSlice';

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Logging out...
      </h2>
    </div>
  );
};