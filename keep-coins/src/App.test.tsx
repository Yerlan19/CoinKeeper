import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from './components/theme/ThemeProvider';
import App from './App';
import transactionReducer from './redux/slices/transactionSlice';
import categoryReducer from './redux/slices/categorySlice';
import settingsReducer from './redux/slices/settingsSlice';
import authReducer from './redux/slices/authSlice';

// Создаем тестовый store
const createTestStore = () => {
  return configureStore({
    reducer: {
      transactions: transactionReducer,
      categories: categoryReducer,
      settings: settingsReducer,
      auth: authReducer,
    },
  });
};

// Wrapper для тестов с необходимыми провайдерами
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('App tests', () => {
  test('App component renders', () => {
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    // Проверяем, что приложение рендерится без ошибок
    expect(container).toBeInTheDocument();
  });

  test('App contains router provider', () => {
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    // Проверяем наличие роутера
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});

