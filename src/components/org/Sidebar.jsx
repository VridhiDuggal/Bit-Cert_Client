import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  Users,
  BadgeCheck,
  ScrollText,
  LogOut,
} from 'lucide-react';
import { logout } from '../../store/auth/authSlice';
import { selectOrgName } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import { PRIMARY, PRIMARY_LIGHT, TEXT, MUTED, BORDER } from '../../styles/tokens';

const NAV_ITEMS = [
  { label: 'Dashboard',        to: '/org/dashboard',    Icon: LayoutDashboard },
  { label: 'Issue Certificate',to: '/org/issue',        Icon: FilePlus },
  { label: 'Recipients',       to: '/org/recipients',   Icon: Users },
  { label: 'Certificates',     to: '/org/certificates', Icon: BadgeCheck },
  { label: 'Audit Logs',       to: '/org/audit-logs',   Icon: ScrollText },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orgName = useSelector(selectOrgName);
  const toast = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have been logged out.');
    navigate('/');
  };

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      backgroundColor: '#fff',
      borderRight: `1px solid ${BORDER}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: PRIMARY }}>Bit-Cert</span>
        {orgName && (
          <p style={{ fontSize: 12, color: MUTED, marginTop: 4, marginBottom: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {orgName}
          </p>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ label, to, Icon }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? PRIMARY : TEXT,
                backgroundColor: active ? PRIMARY_LIGHT : 'transparent',
                textDecoration: 'none',
                borderLeft: active ? `3px solid ${PRIMARY}` : '3px solid transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            color: MUTED,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
