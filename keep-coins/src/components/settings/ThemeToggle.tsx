import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateRegularSettings } from '../../redux/slices/settingsSlice';

export const ThemeToggle = () => {
  const { themeName, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const handleThemeToggle = async () => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    toggleTheme();
    
    if (currentUser) {
      await dispatch(updateRegularSettings({
        userId: currentUser.id,
        settings: { theme: newTheme }
      }));
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <span>Theme: {themeName}</span>
      <button
        onClick={handleThemeToggle}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Toggle
      </button>
    </div>
  );
};