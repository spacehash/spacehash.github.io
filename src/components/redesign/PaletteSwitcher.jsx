import { PALETTES, usePalette } from '../../context/PaletteContext';

const SWATCHES = {
  acid:     { pink: 'oklch(0.78 0.22 135)', cyan: 'oklch(0.72 0.19 25)' },
  blood:    { pink: 'oklch(0.68 0.22 25)',  cyan: 'oklch(0.72 0.14 60)' },
  ultra:    { pink: 'oklch(0.75 0.20 300)', cyan: 'oklch(0.78 0.20 200)' },
  phosphor: { pink: 'oklch(0.85 0.22 140)', cyan: 'oklch(0.82 0.20 90)' },
  sakura:   { pink: 'oklch(0.82 0.14 355)', cyan: 'oklch(0.78 0.10 160)' },
};

export default function PaletteSwitcher() {
  const { palette, setPalette, mode, toggleMode } = usePalette();

  return (
    <div className="palette-switcher">
      <div className="palette-swatches" role="group" aria-label="Palette">
        {PALETTES.map((name) => (
          <button
            key={name}
            type="button"
            className={`swatch ${palette === name ? 'active' : ''}`}
            onClick={() => setPalette(name)}
            aria-label={`Palette ${name}`}
            aria-pressed={palette === name}
            style={{
              '--sw-pink': SWATCHES[name].pink,
              '--sw-cyan': SWATCHES[name].cyan,
            }}
          >
            <span className="swatch-half pink" />
            <span className="swatch-half cyan" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`mode-toggle mode-${mode}`}
        onClick={toggleMode}
        aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? 'DARK' : 'LIGHT'}
      </button>
    </div>
  );
}
