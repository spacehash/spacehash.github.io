import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [visualMode, setVisualMode] = useState('dark');

  const toggleMode = () => {
    const newMode = visualMode === 'light' ? 'dark' : 'light';
    // Update visual state immediately for the toggle animation
    setVisualMode(newMode);
    // Update actual theme state immediately too (no delay)
    setMode(newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode: visualMode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
