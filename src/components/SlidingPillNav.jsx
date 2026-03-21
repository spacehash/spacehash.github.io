import { useRef, useState, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * A navigation bar where a liquid-glass pill slides between items.
 * Extracted from Footer so it can be reused anywhere.
 *
 * Props:
 *   items       — string[] or { label: string }[]
 *   activeIndex — controlled index
 *   onChange    — (index: number) => void
 *   dense       — boolean, compact sizing for use inside modals/panels
 */
function SlidingPillNav({ items, activeIndex, onChange, dense = false }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tabRefs      = useRef([]);
  const containerRef = useRef(null);
  const pillRef      = useRef(null);
  const animRef      = useRef(null);
  const prevPos      = useRef(null);
  const [pill, setPill] = useState({ x: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const idx       = Math.max(0, activeIndex);
    const el        = tabRefs.current[idx];
    const container = containerRef.current;
    const pillEl    = pillRef.current;
    if (!el || !container) return;

    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const to = { x: er.left - cr.left, width: er.width };

    if (prevPos.current && pillEl) {
      const from      = prevPos.current;
      const squeezedW = Math.max(6, Math.min(from.width, to.width) * 0.18);
      const dir       = to.x > from.x ? 1 : -1;
      const overshoot = 8 * dir;
      const fromCenter = from.x + from.width / 2;
      const toCenter   = to.x   + to.width   / 2;

      if (animRef.current) { animRef.current.cancel(); animRef.current = null; }

      const anim = pillEl.animate(
        [
          { transform: `translateX(${from.x}px) translateY(-50%) scaleY(1)`,                               width: `${from.width}px`,        easing: 'ease-in-out' },
          { transform: `translateX(${fromCenter - squeezedW / 2}px) translateY(-50%) scaleY(0.18)`,         width: `${squeezedW}px`,         offset: 0.28, easing: 'linear'  },
          { transform: `translateX(${toCenter   - squeezedW / 2}px) translateY(-50%) scaleY(0.18)`,         width: `${squeezedW}px`,         offset: 0.66, easing: 'ease-out' },
          { transform: `translateX(${to.x + overshoot}px)           translateY(-50%) scaleY(1.1)`,          width: `${to.width * 1.04}px`,   offset: 0.88, easing: 'ease-in-out' },
          { transform: `translateX(${to.x}px)                        translateY(-50%) scaleY(1)`,            width: `${to.width}px` },
        ],
        { duration: 310, easing: 'linear', fill: 'forwards' },
      );
      animRef.current = anim;

      anim.addEventListener('finish', () => {
        if (pillEl && animRef.current === anim) {
          pillEl.style.transform = `translateX(${to.x}px) translateY(-50%)`;
          pillEl.style.width     = `${to.width}px`;
          anim.cancel();
          animRef.current = null;
        }
      });
    }

    prevPos.current = to;
    setPill({ x: to.x, width: to.width, ready: true });
  }, [activeIndex]);

  return (
    <Box sx={{ position: 'relative' }}>

      {/* Track — subtle ring */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '100px',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        }}
      />

      {/* Liquid-glass sliding pill */}
      {pill.ready && (
        <Box
          ref={pillRef}
          aria-hidden
          sx={{
            position:    'absolute',
            top:         '50%',
            left:        0,
            height:      'calc(100% - 16px)',
            width:       pill.width,
            borderRadius:'100px',
            transform:   `translateX(${pill.x}px) translateY(-50%)`,
            willChange:  'transform, width',
            pointerEvents: 'none',
            backdropFilter: 'blur(14px) saturate(180%)',
            bgcolor:     isDark ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.6)',
            border:      '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.9)',
            boxShadow:   isDark
              ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.35)'
              : 'inset 0 1px 0 rgba(255,255,255,1),   0 4px 16px rgba(0,0,0,0.1)',
          }}
        />
      )}

      {/* Items */}
      <Box ref={containerRef} sx={{ position: 'relative', display: 'flex', p: '8px' }}>
        {items.map((item, i) => {
          const label = typeof item === 'string' ? item : item.label;
          return (
            <Box
              key={i}
              ref={el => (tabRefs.current[i] = el)}
              onClick={() => onChange(i)}
              sx={{
                px:           dense ? 1.5 : 4,
                py:           dense ? 0.75 : 1.75,
                borderRadius: '100px',
                cursor:       'pointer',
                fontSize:     dense ? '0.72rem' : '1rem',
                fontWeight:   i === activeIndex ? 600 : 400,
                letterSpacing:'0.04em',
                color: i === activeIndex
                  ? 'text.primary'
                  : isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
                transition:   'color 0.3s ease',
                userSelect:   'none',
                whiteSpace:   'nowrap',
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

    </Box>
  );
}

export default SlidingPillNav;
