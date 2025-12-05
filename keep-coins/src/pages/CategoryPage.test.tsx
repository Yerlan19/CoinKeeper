import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CategoryPage } from './CategoryPage';
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
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('CategoryPage component tests', () => {
  test('CategoryPage component renders', () => {
    render(
      <TestWrapper>
        <CategoryPage />
      </TestWrapper>
    );
    // Проверяем, что заголовок отображается
    expect(screen.getByText(/Manage Categories/i)).toBeInTheDocument();
  });

  test('Add button is present', () => {
    render(
      <TestWrapper>
        <CategoryPage />
      </TestWrapper>
    );
    // Проверяем наличие кнопки добавления категории
    expect(screen.getByText(/Add/i)).toBeInTheDocument();
  });

  test('Category name input field is present', () => {
    render(
      <TestWrapper>
        <CategoryPage />
      </TestWrapper>
    );
    // Проверяем наличие поля ввода названия категории
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
  });
});

