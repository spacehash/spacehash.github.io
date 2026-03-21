import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import HologramViewer from './HologramViewer';

// ─── Keyframe definitions ─────────────────────────────────────────────────────
// "next" direction matches pill sliding right  (higher index selected)
// "prev" direction matches pill sliding left   (lower  index selected)

const exitRight  = keyframes`from { transform: translateX(0); } to { transform: translateX(100%); }`;
const exitLeft   = keyframes`from { transform: translateX(0); } to { transform: translateX(-100%); }`;
const enterLeft  = keyframes`from { transform: translateX(-100%); } to { transform: translateX(0); }`;
const enterRight = keyframes`from { transform: translateX(100%); }  to { transform: translateX(0); }`;

// Spin-exit variants for swipe navigation — spiral off with momentum
const exitLeftSpin  = keyframes`
  from { transform: translateX(0)     rotate(0deg)    scale(1);    opacity: 1; }
  to   { transform: translateX(-115%) rotate(-540deg) scale(0.08); opacity: 0; }
`;
const exitRightSpin = keyframes`
  from { transform: translateX(0)    rotate(0deg)   scale(1);    opacity: 1; }
  to   { transform: translateX(115%) rotate(540deg) scale(0.08); opacity: 0; }
`;

const DURATION      = 340; // ms — normal slide
const SPIN_DURATION = 420; // ms — swipe spin-off (slightly longer for drama)

/**
 * Wraps HologramViewer with a slide transition.
 *
 * Props:
 *   itemName  — equipment name string
 *   direction — 'next' (pill moving right) | 'prev' (pill moving left)
 *   qty       — passed through to HologramViewer (controls fill vs wire + instance count)
 *   height    — passed through to HologramViewer
 */
function SlidingHologram({ itemName, direction, qty = 1, swipeTriggered = false, height }) {
  // Each slide snapshots its own qty + spinOnExit so the exiting slide never
  // flashes the incoming item's state and swipe exits spiral independently.
  const [slides, setSlides] = useState([{ key: 0, name: itemName, phase: 'idle', qty, spinOnExit: false, exitDir: 'next' }]);
  const counterRef = useRef(1);

  // Gear switch → slide transition. Exiting slide keeps its snapshotted qty + spin flag.
  useEffect(() => {
    setSlides(prev => {
      const active = prev.find(s => s.phase === 'idle' || s.phase === 'entering');
      if (!active || active.name === itemName) return prev;

      const newKey = counterRef.current++;
      return [
        { ...active, phase: 'exiting', spinOnExit: swipeTriggered, exitDir: direction },
        { key: newKey, name: itemName, phase: 'entering', qty, spinOnExit: false, exitDir: 'next' },
      ];
    });
  }, [itemName]); // eslint-disable-line

  // Qty change (no gear switch) → update only the active slide.
  useEffect(() => {
    setSlides(prev => prev.map(s =>
      (s.phase === 'idle' || s.phase === 'entering') ? { ...s, qty } : s
    ));
  }, [qty]);

  // Once the exit animation finishes, drop the exiting layer.
  const handleExitEnd = () => {
    setSlides(prev => prev.filter(s => s.phase !== 'exiting'));
  };

  // direction: 'next' → pill moved right → current exits left,  new enters from right
  // direction: 'prev' → pill moved left  → current exits right, new enters from left
  const enterAnim = direction === 'next' ? enterRight : enterLeft;

  return (
    <Box sx={{ position: 'relative', height, overflow: 'hidden' }}>
      {slides.map(slide => {
        const isExiting  = slide.phase === 'exiting';
        const isEntering = slide.phase === 'entering';

        let exitAnim, exitDuration, exitEasing;
        if (isExiting) {
          if (slide.spinOnExit) {
            exitAnim     = slide.exitDir === 'next' ? exitLeftSpin : exitRightSpin;
            exitDuration = SPIN_DURATION;
            exitEasing   = 'cubic-bezier(0.4, 0, 1, 1)'; // accelerate into the spin
          } else {
            exitAnim     = slide.exitDir === 'next' ? exitLeft : exitRight;
            exitDuration = DURATION;
            exitEasing   = 'cubic-bezier(0.4, 0, 0.6, 1)';
          }
        }

        return (
          <Box
            key={slide.key}
            onAnimationEnd={isExiting ? handleExitEnd : undefined}
            sx={{
              position: 'absolute',
              inset: 0,
              animation: isExiting
                ? `${exitAnim} ${exitDuration}ms ${exitEasing} forwards`
                : isEntering
                ? `${enterAnim} ${DURATION}ms cubic-bezier(0.0, 0, 0.2, 1) forwards`
                : 'none',
            }}
          >
            <HologramViewer itemName={slide.name} qty={slide.qty} height="100%" />
          </Box>
        );
      })}
    </Box>
  );
}

export default SlidingHologram;
