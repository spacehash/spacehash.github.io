import { Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../context/ThemeContext';

const ICONS = [
  { Icon: LightModeIcon, forMode: 'light' },
  { Icon: DarkModeIcon, forMode: 'dark' },
];

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isLight = mode === 'light';

  return (
    <Box display="flex" justifyContent="center" py={1}>
      <Box
        onClick={toggleMode}
        role="button"
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.5,
          borderRadius: 20,
          bgcolor: 'grey.800',
          cursor: 'pointer',
        }}
      >
        {/* Sliding indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: isLight ? 4 : 'calc(50% + 2px)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'grey.600',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
        {ICONS.map(({ Icon, forMode }) => (
          <Box
            key={forMode}
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
            <Icon
              sx={{
                fontSize: 20,
                color: mode === forMode ? 'common.white' : 'grey.500',
                transition: 'color 0.3s ease',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ThemeToggle;
