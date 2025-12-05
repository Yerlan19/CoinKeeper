import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddTransaction from './AddTransaction';
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
        user: { id: 1, name: 'Test User', email: 'test@test.com' },
        token: 'test-token',
        loading: false,
        error: null,
      },
    },
  });
};

// Wrapper для тестов
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('AddTransaction component tests', () => {
  test('AddTransaction component renders', () => {
    render(
      <TestWrapper>
        <AddTransaction />
      </TestWrapper>
    );
    // Проверяем, что кнопка добавления отображается
    expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
  });

  test('Open new transaction modal', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <AddTransaction />
      </TestWrapper>
    );
    // Находим кнопку и кликаем
    const addButton = screen.getByText(/Add Transaction/i);
    await user.click(addButton);
    // Проверяем, что модальное окно открылось
    expect(screen.getByText(/Add New Transaction/i)).toBeInTheDocument();
    // Проверяем наличие кнопки Save
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    // Проверяем наличие кнопки Cancel
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });
});

