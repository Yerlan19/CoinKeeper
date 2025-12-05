import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './pages/Login';
import { Logout } from './pages/Logout';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { TransactionDetail } from './pages/TransactionDetail';
import { EditTransaction } from './pages/EditTransaction';
import { CategoryPage } from './pages/CategoryPage';
import { PageNotFound } from './pages/PageNotFound';
import { Transactions } from './pages/Transactions';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'logout', element: <Logout /> },
        { path: 'register', element: <Register /> },
        {
          element: <ProtectedRoute />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'dashboard/:id', element: <TransactionDetail /> },
            { path: 'transactions', element: <Transactions /> },
            { path: 'category', element: <CategoryPage /> },
            { path: 'stats', element: <Stats /> },
            { path: 'settings', element: <Settings /> },
            { path: 'edit-transaction/:id', element: <EditTransaction /> },
          ],
        },
        { path: '*', element: <PageNotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);


export const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <CssBaseline />
          <div className="transition-colors duration-300">
            <RouterProvider router={router}/>
          </div>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;