import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { TEXT, BORDER, MUTED, DANGER } from '../../styles/tokens';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';
import { selectUnreadCount } from '../../features/recipientNotifications/recipientNotificationsSelectors';
import { fetchUnreadCount } from '../../features/recipientNotifications/recipientNotificationsThunks';

export function RecipientHeader({ title, subtitle }) {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const token       = useSelector(selectRecipientToken);
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    if (token) dispatch(fetchUnreadCount());
  }, [dispatch, token]);

  return (
    <header style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${BORDER}`,
      padding: '0 32px',
      backgroundColor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0', fontWeight: 400 }}>{subtitle}</p>
        )}
      </div>

      <button
        onClick={() => navigate('/recipient/notifications')}
        title="Notifications"
        style={{
          position: 'relative',
          background: 'none',
          border: `1px solid ${BORDER}`,
          padding: 8,
          borderRadius: 10,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MUTED,
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f5f0'; e.currentTarget.style.color = '#1a202c'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = MUTED; }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            minWidth: 16,
            height: 16,
            borderRadius: 9999,
            backgroundColor: DANGER,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            lineHeight: 1,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </header>
  );
}
