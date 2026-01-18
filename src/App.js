import { CssBaseline, Box } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ minHeight: '-webkit-fill-available' }}
    >
      <CssBaseline />
      <ThemeToggle />
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="auto"
        sx={{ minHeight: 0 }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
