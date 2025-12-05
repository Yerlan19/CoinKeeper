import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { 
  fetchUserSettings, 
  updateSecureSettings,
  clearPasswordVerification
} from '../redux/slices/settingsSlice';
import { SettingsForm, ThemeToggle, CurrencyToggle } from '../components/settings';
import { getCurrentUser } from '../api/users';
import type { User } from '../types/types';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { currentSettings, loading, error } = useAppSelector((state) => state.settings);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser({ ...user, id: Number(user.id) });
        setName(user.name);
        setEmail(user.email);
        dispatch(fetchUserSettings(Number(user.id)));
      }
    };
    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (currentSettings) {
      setName(currentSettings.name || currentUser?.name || '');
      setEmail(currentSettings.email || currentUser?.email || '');
    }
  }, [currentSettings, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    dispatch(clearPasswordVerification());

    if (!currentUser) return;

    try {
      await dispatch(updateSecureSettings({
        userId: Number(currentUser.id), 
        email: currentUser.email,
        settings: { name, email },
        password
      })).unwrap();

      setSuccess('Settings updated successfully');
      setEditMode(false);
      setPassword('');
    } catch {
      // Ошибка обрабатывается в slice
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(currentSettings?.name || currentUser?.name || '');
    setEmail(currentSettings?.email || currentUser?.email || '');
    setPassword('');
    dispatch(clearPasswordVerification());
  };

  if (!currentUser) {
    return <div className="text-center mt-8">Loading user data...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300 sm:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">User Settings</h2>

      <SettingsForm
        currentUser={currentUser}
        editMode={editMode}
        name={name}
        email={email}
        password={password}
        loading={loading}
        error={error || ''}
        success={success}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onEditToggle={() => setEditMode(true)}
      />

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle />
        <CurrencyToggle />
      </div>
    </div>
  );
};
