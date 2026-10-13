import { faBars, faGaugeHigh, faUsers, faFlag, faBan, faBullhorn, faCircleUser, faCircleDot, faClockRotateLeft, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../features/auth/AuthContext';
import { Icon } from './Icon';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: faGaugeHigh, end: true },
  { to: '/users', label: 'Users', icon: faUsers, end: false },
  { to: '/reports', label: 'Reports', icon: faFlag, end: false },
  { to: '/blocked', label: 'Blocked', icon: faBan, end: false },
  { to: '/broadcast', label: 'Broadcast', icon: faBullhorn, end: false },
  { to: '/system-account', label: 'System Account', icon: faCircleUser, end: false },
  { to: '/status', label: 'Status', icon: faCircleDot, end: false },
  { to: '/audit-log', label: 'Audit Log', icon: faClockRotateLeft, end: false },
] as const;

/** Persistent sidebar nav on wide viewports, an off-canvas drawer (hamburger-triggered) under the 768px breakpoint — see index.css's responsive rules. */
export function Layout({ children }: { children: React.ReactNode }) {
  const { displayName, username, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">RiskyC Admin</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon icon={item.icon} style={{ marginRight: 10 }} />
            {item.label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <div style={{ marginBottom: 10 }}>Signed in as {displayName || username}</div>
          <button type="button" className="link-button" onClick={handleLogout}>
            <Icon icon={faRightFromBracket} style={{ marginRight: 8 }} />
            Sign out
          </button>
        </div>
      </nav>

      <main className="content">
        <button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle menu">
          <Icon icon={faBars} />
        </button>
        {children}
      </main>
    </div>
  );
}
