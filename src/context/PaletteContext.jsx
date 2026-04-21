import { createContext, useContext, useEffect, useState } from 'react';

const PaletteContext = createContext(null);

export const PALETTES = ['acid', 'blood', 'ultra', 'phosphor', 'sakura'];
export const MODES = ['dark', 'light'];

const STORAGE_PALETTE = 'sh-palette';
const STORAGE_MODE = 'sh-mode';

function readStored(key, fallback, allowed) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v && allowed.includes(v)) return v;
  } catch {}
  return fallback;
}

export function PaletteProvider({ children }) {
  const [palette, setPaletteState] = useState(() => readStored(STORAGE_PALETTE, 'acid', PALETTES));
  const [mode, setModeState] = useState(() => readStored(STORAGE_MODE, 'dark', MODES));

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    try { window.localStorage.setItem(STORAGE_PALETTE, palette); } catch {}
  }, [palette]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    try { window.localStorage.setItem(STORAGE_MODE, mode); } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff');
  }, [mode]);

  const setPalette = (next) => {
    if (PALETTES.includes(next)) setPaletteState(next);
  };

  const toggleMode = () => setModeState((m) => (m === 'dark' ? 'light' : 'dark'));
  const setMode = (next) => {
    if (MODES.includes(next)) setModeState(next);
  };

  return (
    <PaletteContext.Provider value={{ palette, setPalette, mode, setMode, toggleMode }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error('usePalette must be used within PaletteProvider');
  return ctx;
}
