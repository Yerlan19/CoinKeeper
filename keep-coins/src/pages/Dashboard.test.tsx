import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Dashboard } from './Dashboard';
import transactionReducer from '../redux/slices/transactionSlice';
import categoryReducer from '../redux/slices/categorySlice';
import settingsReducer from '../redux/slices/settingsSlice';
import authReducer from '../redux/slices/authSlice';

// Создаем тестовый store
const createTestStore = () => {
  return configureStore({
    reducer: {
      transactions: transactionReducer,
      categories: categoryReducer,
      settings: settingsReducer,
      auth: authReducer,
    },
    preloadedState: {
      transactions: {
        items: [],
        loading: false,
        error: null,
      },
      categories: {
        items: [],
        loading: false,
        error: null,
      },
      settings: {
        currentSettings: null,
        loading: false,
        error: null,
      },
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
      },
    },
  });
};

// Wrapper для тестов
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('Dashboard component tests', () => {
  test('Dashboard component renders', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    // Проверяем, что заголовок Dashboard отображается
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('Current Balance section is present', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    // Проверяем наличие секции баланса
    expect(screen.getByText(/Current Balance:/i)).toBeInTheDocument();
  });

  test('Add Transaction button is present', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    // Проверяем наличие кнопки добавления транзакции
    expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
  });
});

