import { Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../context/ThemeContext';

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box display="flex" justifyContent="center" py={1}>
      <Box
        onClick={toggleMode}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.5,
          borderRadius: 20,
          bgcolor: '#333',
          cursor: 'pointer',
        }}
      >
        {/* Sliding background */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: mode === 'light' ? 4 : 'calc(50% + 2px)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#676767ff',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            filter: 'blur(0px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              bgcolor: 'inherit',
              filter: 'blur(4px)',
              opacity: 0.6,
              transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
          }}
        />
        {/* Sun icon */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
          }}
        >
          <LightModeIcon
            sx={{
              fontSize: 20,
              color: mode === 'light' ? '#fff' : '#9e9e9e',
              transition: 'color 0.3s ease',
            }}
          />
        </Box>
        {/* Moon icon */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
          }}
        >
          <DarkModeIcon
            sx={{
              fontSize: 20,
              color: mode === 'dark' ? '#fff' : '#9e9e9e',
              transition: 'color 0.3s ease',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ThemeToggle;
