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
      backgroundColor: '#fff',
      flexShrink: 0,
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
          border: 'none',
          padding: 8,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MUTED,
        }}
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
