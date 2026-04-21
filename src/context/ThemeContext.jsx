import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { usePalette } from './PaletteContext';

export function useThemeMode() {
  const { mode, toggleMode } = usePalette();
  return { mode, toggleMode };
}

export function ThemeModeProvider({ children }) {
  const { mode } = usePalette();

  const theme = useMemo(
    () => createTheme({ palette: { mode } }),
    [mode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
