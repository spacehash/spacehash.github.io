import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@mui/material';
import GearHologram from './GearHologram';
import { useThemeMode } from '../../context/ThemeContext';

/**
 * Props:
 *   itemName — equipment name string, used to pick the right model
 *   qty      — selected quantity; controls fill vs wire-only and instance count
 *   height   — number (px) or string (e.g. "100%") — defaults to 210
 */
function HologramViewer({ itemName, qty = 1, height = 210 }) {
  const { mode } = useThemeMode();
  const lightMode = mode === 'light';

  return (
    <Box sx={{ height, width: '100%', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 1.4, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <GearHologram itemName={itemName} qty={qty} lightMode={lightMode} />
        </Suspense>
      </Canvas>
    </Box>
  );
}

export default HologramViewer;
