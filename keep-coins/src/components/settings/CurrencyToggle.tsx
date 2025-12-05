import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateRegularSettings } from '../../redux/slices/settingsSlice';

const currencies = [
  { code: 'KZT', name: 'Kazakhstani Tenge' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'RUB', name: 'Russian Ruble' },
];

export const CurrencyToggle = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentSettings = useAppSelector((state) => state.settings.currentSettings);
  const currentCurrency = currentSettings?.currency || 'KZT';

  const handleCurrencyChange = async (newCurrency: string) => {
    if (currentUser) {
      await dispatch(updateRegularSettings({
        userId: currentUser.id,
        settings: { currency: newCurrency }
      }));
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <span>Currency: {currentCurrency}</span>
      <select
        value={currentCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    </div>
  );
};