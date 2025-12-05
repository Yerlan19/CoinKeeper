import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { register } from '../redux/slices/authSlice';
import { AuthForm } from '../components/AuthForm';
import { LoadingScreen } from '../components/LoadingScreen';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password })).unwrap().then(() => navigate('/')).catch(() => {});
  };

  if (loading) return <LoadingScreen />;

  return (
    <AuthForm
      type="register"
      name={name}
      email={email}
      password={password}
      loading={loading}
      error={error || ''}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      switchAuth={() => navigate('/login')}
    />
  );
};