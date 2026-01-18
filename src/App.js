import { CssBaseline, Box } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <CssBaseline />
      <ThemeToggle />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" overflow="hidden">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
