import { CssBaseline, Box } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // iOS Safari full-height fix
        '@supports (-webkit-touch-callout: none)': {
          minHeight: '-webkit-fill-available',
        },
      }}
    >
      <CssBaseline />
      <ThemeToggle />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
