import { useRef, useState, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useRouterState } from '@tanstack/react-router';

const TABS = [
  { label: 'home', to: '/home' },
  { label: 'rentals', to: '/rentals' },
  { label: 'about', to: '/about' },
];

function Footer() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const activeIndex = TABS.findIndex((tab, i) => {
    if (i === 0) return pathname === '/' || pathname === '/home';
    return pathname === tab.to || pathname.startsWith(tab.to + '/');
  });

  const tabRefs = useRef([]);
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const animRef = useRef(null);
  const prevPos = useRef(null);
  const [pill, setPill] = useState({ x: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const idx = activeIndex < 0 ? 0 : activeIndex;
    const el = tabRefs.current[idx];
    const container = containerRef.current;
    const pillEl = pillRef.current;
    if (!el || !container) return;

    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const to = { x: er.left - cr.left, width: er.width };

    if (prevPos.current && pillEl) {
      const from = prevPos.current;
      const squeezedW = Math.max(6, Math.min(from.width, to.width) * 0.18);
      const dir = to.x > from.x ? 1 : -1;
      const overshoot = 8 * dir;

      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }

      const fromCenter = from.x + from.width / 2;
      const toCenter = to.x + to.width / 2;

      const anim = pillEl.animate(
        [
          {
            transform: `translateX(${from.x}px) translateY(-50%) scaleY(1)`,
            width: `${from.width}px`,
            easing: 'ease-in-out',
          },
          {
            transform: `translateX(${fromCenter - squeezedW / 2}px) translateY(-50%) scaleY(0.18)`,
            width: `${squeezedW}px`,
            offset: 0.28,
            easing: 'linear',
          },
          {
            transform: `translateX(${toCenter - squeezedW / 2}px) translateY(-50%) scaleY(0.18)`,
            width: `${squeezedW}px`,
            offset: 0.66,
            easing: 'ease-out',
          },
          {
            transform: `translateX(${to.x + overshoot}px) translateY(-50%) scaleY(1.1)`,
            width: `${to.width * 1.04}px`,
            offset: 0.88,
            easing: 'ease-in-out',
          },
          {
            transform: `translateX(${to.x}px) translateY(-50%) scaleY(1)`,
            width: `${to.width}px`,
          },
        ],
        { duration: 310, easing: 'linear', fill: 'forwards' }
      );

      animRef.current = anim;

      anim.addEventListener('finish', () => {
        if (pillEl && animRef.current === anim) {
          pillEl.style.transform = `translateX(${to.x}px) translateY(-50%)`;
          pillEl.style.width = `${to.width}px`;
          anim.cancel();
          animRef.current = null;
        }
      });
    }

    prevPos.current = to;
    setPill({ x: to.x, width: to.width, ready: true });
  }, [activeIndex]);

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
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

        {/* Liquid glass pill */}
        {pill.ready && (
          <Box
            ref={pillRef}
            aria-hidden
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              height: 'calc(100% - 16px)',
              width: pill.width,
              borderRadius: '100px',
              transform: `translateX(${pill.x}px) translateY(-50%)`,
              willChange: 'transform, width',
              pointerEvents: 'none',
              backdropFilter: 'blur(14px) saturate(180%)',
              bgcolor: isDark ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.6)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.9)',
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.35)'
                : 'inset 0 1px 0 rgba(255,255,255,1), 0 4px 16px rgba(0,0,0,0.1)',
            }}
          />
        )}

        {/* Links */}
        <Box
          ref={containerRef}
          sx={{ position: 'relative', display: 'flex', p: '8px' }}
        >
          {TABS.map((tab, i) => (
            <Box
              key={tab.to}
              ref={el => (tabRefs.current[i] = el)}
              component={RouterLink}
              to={tab.to}
              sx={{
                px: 4,
                py: 1.75,
                borderRadius: '100px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: i === activeIndex ? 600 : 400,
                letterSpacing: '0.04em',
                color: i === activeIndex
                  ? 'text.primary'
                  : isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
                transition: 'color 0.3s ease',
                userSelect: 'none',
                display: 'block',
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
