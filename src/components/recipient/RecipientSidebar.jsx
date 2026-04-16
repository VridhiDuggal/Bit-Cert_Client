import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BadgeCheck,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { recipientLogout } from '../../store/recipientAuth/recipientAuthSlice';
import { selectRecipient } from '../../store/recipientAuth/recipientAuthSelectors';
import { selectUnreadCount } from '../../features/recipientNotifications/recipientNotificationsSelectors';
import { UnreadBadge } from '../ui/UnreadBadge';
import { useToast } from '../../hooks/useToast';
import { PRIMARY, TEXT, MUTED, BORDER } from '../../styles/tokens';

const NAV_ITEMS = [
  { label: 'Dashboard',       to: '/recipient/dashboard',     Icon: LayoutDashboard },
  { label: 'My Certificates', to: '/recipient/certificates',  Icon: BadgeCheck },
  { label: 'Notifications',   to: '/recipient/notifications', Icon: Bell, badge: true },
  { label: 'Settings',        to: '/recipient/settings',      Icon: Settings },
];

function NavItem({ to, Icon, label, active, badge, unreadCount }) {
  return (
    <NavLink
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? PRIMARY : MUTED,
        backgroundColor: active ? `${PRIMARY}14` : 'transparent',
        borderLeft: active ? `3px solid ${PRIMARY}` : '3px solid transparent',
        textDecoration: 'none',
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = '#f0f5f0'; e.currentTarget.style.color = TEXT; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = MUTED; } }}
    >
      <Icon size={15} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <UnreadBadge count={unreadCount} />}
    </NavLink>
  );
}

export function RecipientSidebar() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const location    = useLocation();
  const recipient   = useSelector(selectRecipient);
  const unreadCount = useSelector(selectUnreadCount);
  const toast       = useToast();

  const handleLogout = () => {
    dispatch(recipientLogout());
    toast.info('You have been logged out.');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafcfa 0%, #f7fbf7 100%)',
      borderRight: `1px solid ${BORDER}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
    }}>
      <div style={{ padding: '18px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            backgroundColor: PRIMARY,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BadgeCheck size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: -0.3 }}>Bit-Cert</span>
        </div>
        {recipient && (
          <div style={{
            marginTop: 12,
            padding: '8px 10px',
            backgroundColor: '#f9fafb',
            borderRadius: 8,
            border: `1px solid ${BORDER}`,
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 2px' }}>Recipient</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {recipient.name}
            </p>
          </div>
        )}
      </div>

      <div style={{ height: 1, backgroundColor: BORDER, margin: '0 16px' }} />

      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {NAV_ITEMS.map(({ label, to, Icon, badge }) => (
          <NavItem
            key={to}
            to={to}
            Icon={Icon}
            label={label}
            active={isActive(to)}
            badge={badge}
            unreadCount={unreadCount}
          />
        ))}
      </nav>

      <div style={{ height: 1, backgroundColor: BORDER, margin: '0 16px' }} />

      <div style={{ padding: '8px 8px 12px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 400,
            color: MUTED,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = MUTED; }}
        >
          <LogOut size={15} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
