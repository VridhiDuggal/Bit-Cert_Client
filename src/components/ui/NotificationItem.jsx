import { Award, ShieldX, Sparkles, ExternalLink } from 'lucide-react';
import { DANGER, INFO, SUCCESS, PRIMARY, BORDER, WHITE, SURFACE, TEXT, MUTED, TEXT_MUTED, RADIUS, SPACING, DURATION } from '../../styles/tokens';

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_CONFIG = {
  CERTIFICATE_ISSUED:  { color: SUCCESS, Icon: Award    },
  CERTIFICATE_REVOKED: { color: DANGER,  Icon: ShieldX  },
  WELCOME:             { color: INFO,    Icon: Sparkles },
};

export function NotificationItem({ notification, onRead, onVerify }) {
  const { color, Icon } = TYPE_CONFIG[notification.type] ?? { color: INFO, Icon: Sparkles };
  const isUnread = !notification.is_read;

  return (
    <div
      onClick={() => onRead && onRead(notification.notification_id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: SPACING.md,
        padding: '12px 16px',
        borderRadius: RADIUS.md,
        border: `1px solid ${BORDER}`,
        backgroundColor: isUnread ? `${INFO}0d` : WHITE,
        cursor: onRead ? 'pointer' : 'default',
        transition: `background-color ${DURATION.normal} ease, opacity ${DURATION.normal} ease`,
      }}
      onMouseEnter={e => { if (isUnread) e.currentTarget.style.backgroundColor = `${INFO}18`; else e.currentTarget.style.backgroundColor = SURFACE; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isUnread ? `${INFO}0d` : WHITE; }}
    >
      <div style={{
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: `${color}26`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={16} color={color} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: isUnread ? 500 : 400, color: TEXT, lineHeight: 1.4 }}>
          {notification.title}
        </p>
        {notification.body && (
          <p style={{ margin: '2px 0 0', fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
            {notification.body}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: TEXT_MUTED }}>
            {relativeTime(notification.created_at)}
          </p>
          {onVerify && (
            <button
              onClick={e => { e.stopPropagation(); onVerify(notification.cert_hash); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 600, color: PRIMARY,
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              }}
            >
              <ExternalLink size={11} /> Verify
            </button>
          )}
        </div>
      </div>

      {isUnread && (
        <div style={{
          flexShrink: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: DANGER,
          marginTop: 6,
        }} />
      )}
    </div>
  );
}
