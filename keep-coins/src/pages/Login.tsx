import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { login } from '../redux/slices/authSlice';
import { AuthForm } from '../components/AuthForm';
import { LoadingScreen } from '../components/LoadingScreen';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        // Показываем сообщение об ошибке через Snackbar
        setSnackbarMessage(err?.message || 'Login failed: Check your email and password');
        setOpenSnackbar(true);
      });
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <AuthForm
        type="login"
        email={email}
        password={password}
        loading={loading}
        error={error || ''}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        switchAuth={() => navigate('/register')}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};