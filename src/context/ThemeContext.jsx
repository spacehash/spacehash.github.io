import { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Keep iOS Safari address bar in sync with theme
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff');
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark' && {
            background: {
              default: '#000000',
              paper: '#0a0a0a',
            },
            text: {
              primary: '#00ff41',
              secondary: 'rgba(0,255,65,0.5)',
            },
            primary: {
              main: '#00ff41',
              contrastText: '#000000',
            },
          }),
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
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
