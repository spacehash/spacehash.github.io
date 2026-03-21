import { Box } from '@mui/material';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import SlidingPillNav from './SlidingPillNav';

const TABS = [
  { label: 'home',    to: '/home'    },
  { label: 'rentals', to: '/rentals' },
  { label: 'about',   to: '/about'   },
];

function Footer() {
  const routerState = useRouterState();
  const navigate    = useNavigate();
  const pathname    = routerState.location.pathname;

  const activeIndex = TABS.findIndex((tab, i) => {
    if (i === 0) return pathname === '/' || pathname === '/home';
    return pathname === tab.to || pathname.startsWith(tab.to + '/');
  });

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
      <SlidingPillNav
        items={TABS}
        activeIndex={activeIndex < 0 ? 0 : activeIndex}
        onChange={(i) => navigate({ to: TABS[i].to })}
      />
    </Box>
  );
}

export default Footer;
