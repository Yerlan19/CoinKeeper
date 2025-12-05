import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAppSelector } from '../hooks/reduxHooks';

// Импорты компонентов Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export const Layout = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { toggleTheme, themeName } = useTheme();

  return (
    // Внешний контейнер оставляем с твоими классами для поддержки темной темы
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Заменяем старый nav на компонент AppBar из Material UI */}
      <AppBar position="static" enableColorOnDark> 
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            
            {/* Логотип */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Keep Coins
            </Typography>

            {/* Блок кнопок меню */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {currentUser ? (
                <>
                  {/* Используем MUI Button вместо обычных button */}
                  <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                  <Button color="inherit" onClick={() => navigate('/transactions')}>Transactions</Button>
                  <Button color="inherit" onClick={() => navigate('/category')}>Category</Button>
                  <Button color="inherit" onClick={() => navigate('/stats')}>Statistics</Button>
                  <Button color="inherit" onClick={() => navigate('/settings')}>Settings</Button>
                  <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>
                </>
              ) : (
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              )}

              {/* Кнопка переключения темы */}
              <Button color="inherit" onClick={toggleTheme} sx={{ minWidth: '40px', fontSize: '1.2rem' }}>
                {themeName === 'dark' ? '☀️' : '🌙'}
              </Button>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};