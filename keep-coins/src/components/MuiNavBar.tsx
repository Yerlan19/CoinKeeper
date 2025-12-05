import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

export const MuiNavBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Название приложения */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            Keep Coins
          </Typography>

          {/* Кнопки меню */}
          <Button component={Link} to="/dashboard" sx={{ my: 2, color: 'white', display: 'block' }}>
            Dashboard
          </Button>
          <Button component={Link} to="/category" sx={{ my: 2, color: 'white', display: 'block' }}>
            Category
          </Button>
          <Button component={Link} to="/stats" sx={{ my: 2, color: 'white', display: 'block' }}>
            Statistics
          </Button>
          <Button component={Link} to="/settings" sx={{ my: 2, color: 'white', display: 'block' }}>
            Settings
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};