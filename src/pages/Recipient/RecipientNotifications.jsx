import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, BellOff } from 'lucide-react';
import { RecipientLayout } from '../../components/recipient/RecipientLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { NotificationItem } from '../../components/ui/NotificationItem';
import { useToast } from '../../hooks/useToast';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../features/recipientNotifications/recipientNotificationsThunks';
import { setPage, setFilter } from '../../features/recipientNotifications/recipientNotificationsSlice';
import {
  selectNotifications,
  selectNotificationsTotal,
  selectNotificationsPage,
  selectNotificationsFilter,
  selectNotificationsLoading,
  selectUnreadCount,
} from '../../features/recipientNotifications/recipientNotificationsSelectors';
import {
  PRIMARY, TEXT, MUTED, BORDER, WHITE, SURFACE,
  SPACING, SHADOW, RADIUS, DURATION,
} from '../../styles/tokens';

const LIMIT = 20;

const TABS = [
  { label: 'All',     value: 'all'                  },
  { label: 'Unread',  value: 'unread'               },
  { label: 'Issued',  value: 'CERTIFICATE_ISSUED'   },
  { label: 'Revoked', value: 'CERTIFICATE_REVOKED'  },
];

const EMPTY_STATE_CONFIG = {
  all:                  { icon: Bell,    title: 'No notifications yet',           description: 'Notifications from your organizations will appear here.' },
  unread:               { icon: BellOff, title: "You're all caught up",           description: 'No unread notifications.' },
  CERTIFICATE_ISSUED:   { icon: Bell,    title: 'No issued certificate notifications', description: '' },
  CERTIFICATE_REVOKED:  { icon: Bell,    title: 'No revocation notifications',    description: '' },
};

function ShimmerOverlay() {
  return (
    <>
      <style>{`@keyframes bcShimmer2{from{background-position:200% 0}to{background-position:-200% 0}}`}</style>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg,transparent 25%,rgba(255,255,255,0.6) 50%,transparent 75%)',
        backgroundSize: '200% 100%',
        animation: 'bcShimmer2 1.4s infinite',
      }} />
    </>
  );
}

function NotifSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          display: 'flex', gap: SPACING.md, alignItems: 'center',
          padding: '12px 16px', borderRadius: RADIUS.md,
          border: `1px solid ${BORDER}`, backgroundColor: WHITE,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e5e7eb', flexShrink: 0, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 12, width: '60%', backgroundColor: '#e5e7eb', borderRadius: 4, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
            <div style={{ height: 10, width: '40%', backgroundColor: '#e5e7eb', borderRadius: 4, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecipientNotifications() {
  const dispatch    = useDispatch();
  const toast       = useToast();
  const notifications  = useSelector(selectNotifications);
  const total          = useSelector(selectNotificationsTotal);
  const page           = useSelector(selectNotificationsPage);
  const filter         = useSelector(selectNotificationsFilter);
  const loading        = useSelector(selectNotificationsLoading);
  const unreadCount    = useSelector(selectUnreadCount);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch, page, filter]);

  const handleFilterChange = (val) => {
    dispatch(setFilter(val));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleMarkAllRead = async () => {
    await dispatch(markAllNotificationsRead());
    toast.success('All notifications marked as read.');
  };

  const handleRead = (notification_id) => {
    dispatch(markNotificationRead(notification_id));
  };

  const start = (page - 1) * LIMIT + 1;
  const end   = Math.min(page * LIMIT, total);
  const hasPrev = page > 1;
  const hasNext = page * LIMIT < total;

  const emptyCfg = EMPTY_STATE_CONFIG[filter] ?? EMPTY_STATE_CONFIG.all;

  return (
    <RecipientLayout title="Notifications" subtitle="Stay up to date with your certificates">
      <PageHeader
        title="Notifications"
        actions={unreadCount > 0 ? [{
          label: 'Mark all as read',
          variant: 'outline',
          onClick: handleMarkAllRead,
        }] : []}
      />

      <div style={{ marginBottom: SPACING.lg, display: 'flex', gap: SPACING.sm, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              style={{
                padding: '6px 16px',
                borderRadius: RADIUS.full,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                backgroundColor: active ? PRIMARY : 'transparent',
                color: active ? WHITE : MUTED,
                transition: `background-color ${DURATION.fast}, color ${DURATION.fast}`,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = SURFACE; e.currentTarget.style.color = TEXT; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = MUTED; } }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <NotifSkeleton />
      ) : notifications.length === 0 ? (
        <EmptyState icon={emptyCfg.icon} title={emptyCfg.title} description={emptyCfg.description} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {notifications.map((notif, idx) => (
            <div
              key={notif.notification_id}
              style={{
                opacity: 0,
                animation: `fadeInUp ${DURATION.slow} ease forwards`,
                animationDelay: `${idx * 40}ms`,
              }}
            >
              <NotificationItem
                notification={notif}
                onRead={notif.cert_hash
                  ? (id) => { handleRead(id); window.open(`/verify/${notif.cert_hash}`, '_blank', 'noopener'); }
                  : handleRead
                }
              />
            </div>
          ))}
        </div>
      )}

      {!loading && total > LIMIT && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg }}>
          <span style={{ fontSize: 13, color: MUTED }}>
            Showing {start}–{end} of {total}
          </span>
          <div style={{ display: 'flex', gap: SPACING.sm }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={!hasPrev}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </RecipientLayout>
  );
}
