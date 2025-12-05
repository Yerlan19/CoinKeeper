import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Transactions } from './Transactions';
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

describe('Transactions component tests', () => {
  test('Transactions component renders', () => {
    render(
      <TestWrapper>
        <Transactions />
      </TestWrapper>
    );
    // Проверяем, что заголовок отображается
    expect(screen.getByText(/Transactions Management/i)).toBeInTheDocument();
  });

  test('CREATE button is present', () => {
    render(
      <TestWrapper>
        <Transactions />
      </TestWrapper>
    );
    // Проверяем наличие кнопки создания
    expect(screen.getByText(/CREATE/i)).toBeInTheDocument();
  });

  test('Export CSV button is present', () => {
    render(
      <TestWrapper>
        <Transactions />
      </TestWrapper>
    );
    // Проверяем наличие кнопки экспорта
    expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
  });
});

