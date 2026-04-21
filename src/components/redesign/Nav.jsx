import { useNavigate, useRouterState } from '@tanstack/react-router';

const TABS = [
  { label: 'HOME', to: '/home' },
  { label: 'RENTALS', to: '/rentals' },
  { label: 'ABOUT', to: '/about' },
];

export default function Nav() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const activeIndex = TABS.findIndex((tab, i) => {
    if (i === 0) return pathname === '/' || pathname === '/home';
    return pathname === tab.to || pathname.startsWith(tab.to + '/');
  });

  return (
    <div className="nav">
      <div className="nav-tabs">
        {TABS.map((tab, i) => (
          <div
            key={tab.label}
            className={`tab ${i === activeIndex ? 'active' : ''}`}
            onClick={() => navigate({ to: tab.to })}
          >
            <span className="idx">0{i + 1}</span>{tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}
