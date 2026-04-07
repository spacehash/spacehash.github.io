import { CssBaseline, Box } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import './styles/CRTEffects.css';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        // Fallback for browsers that don't support dvh
        '@supports not (min-height: 100dvh)': {
          minHeight: '100vh',
        },
        // iOS Safari full-height fix for older versions without dvh
        '@supports (-webkit-touch-callout: none) and (not (min-height: 100dvh))': {
          minHeight: '-webkit-fill-available',
        },
      }}
    >
      <div className="crt-overlay" />
      <div className="crt-glare" />
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
