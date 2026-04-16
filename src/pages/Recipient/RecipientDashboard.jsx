import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Award, Building2, ShieldCheck, ExternalLink } from 'lucide-react';
import { RecipientLayout } from '../../components/recipient/RecipientLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { NotificationItem } from '../../components/ui/NotificationItem';
import { selectRecipient } from '../../store/recipientAuth/recipientAuthSelectors';
import {
  fetchRecipientStats,
  fetchRecentCertificates,
  fetchRecentNotifications,
} from '../../features/recipientDashboard/recipientDashboardThunks';
import { markRecentNotificationRead } from '../../features/recipientDashboard/recipientDashboardSlice';
import { markNotificationRead } from '../../features/recipientNotifications/recipientNotificationsThunks';
import {
  selectRecipientStats,
  selectStatsLoading,
  selectRecentCertificates,
  selectRecentCertsLoading,
  selectRecentNotifications,
  selectRecentNotifsLoading,
} from '../../features/recipientDashboard/recipientDashboardSelectors';
import {
  TEXT, MUTED, BORDER, PRIMARY, WHITE,
  SPACING, SHADOW, RADIUS, DURATION,
} from '../../styles/tokens';

function ShimmerOverlay() {
  return (
    <>
      <style>{`@keyframes bcShimmer{from{background-position:200% 0}to{background-position:-200% 0}}`}</style>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg,transparent 25%,rgba(255,255,255,0.6) 50%,transparent 75%)',
        backgroundSize: '200% 100%',
        animation: 'bcShimmer 1.4s infinite',
      }} />
    </>
  );
}

function RowSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', gap: SPACING.md, padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ height: 14, flex: 3, backgroundColor: '#e5e7eb', borderRadius: 4, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
          <div style={{ height: 14, flex: 2, backgroundColor: '#e5e7eb', borderRadius: 4, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
          <div style={{ height: 14, flex: 1, backgroundColor: '#e5e7eb', borderRadius: 4, position: 'relative', overflow: 'hidden' }}><ShimmerOverlay /></div>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ title, linkLabel, linkTo, navigate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: TEXT, margin: 0 }}>{title}</h2>
      <button
        onClick={() => navigate(linkTo)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: PRIMARY, padding: 0 }}
      >
        {linkLabel} →
      </button>
    </div>
  );
}

const CERT_COLUMNS = [
  { key: 'course', label: 'Course' },
  { key: 'org_name', label: 'Issued By', render: (row) => row.org_name ?? '—' },
  { key: 'issued_at', label: 'Date', render: (row) => row.issued_at ? new Date(row.issued_at).toLocaleDateString() : '—' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge variant={row.is_revoked ? 'danger' : 'success'} size="sm">
        {row.is_revoked ? 'Revoked' : 'Active'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: '',
    render: (row) => row.cert_hash ? (
      <button
        onClick={(e) => { e.stopPropagation(); window.open(`/verify/${row.cert_hash}`, '_blank', 'noopener'); }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'none', border: `1px solid ${BORDER}`, cursor: 'pointer',
          fontSize: 11, fontWeight: 500, color: MUTED, borderRadius: RADIUS.sm,
          padding: '3px 8px', transition: `color ${DURATION.fast}, border-color ${DURATION.fast}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = PRIMARY; e.currentTarget.style.borderColor = PRIMARY; }}
        onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}
      >
        <ExternalLink size={11} /> Verify
      </button>
    ) : null,
  },
];

export default function RecipientDashboard() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const recipient  = useSelector(selectRecipient);
  const stats         = useSelector(selectRecipientStats);
  const statsLoading  = useSelector(selectStatsLoading);
  const recentCerts   = useSelector(selectRecentCertificates);
  const certsLoading  = useSelector(selectRecentCertsLoading);
  const recentNotifs  = useSelector(selectRecentNotifications);
  const notifsLoading = useSelector(selectRecentNotifsLoading);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipientStats());
    dispatch(fetchRecentCertificates());
    dispatch(fetchRecentNotifications());
    const id = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(id);
  }, [dispatch]);

  const handleNotifRead = (notification_id) => {
    dispatch(markRecentNotificationRead(notification_id));
    dispatch(markNotificationRead(notification_id));
  };

  const STAT_CARDS = [
    { key: 'total_certificates',  title: 'Total Certificates', icon: Award,       color: '#14b8a6' },
    { key: 'orgs_count',          title: 'Issued By',          icon: Building2,   color: '#8b5cf6' },
    { key: 'total_verifications', title: 'Times Verified',     icon: ShieldCheck, color: PRIMARY   },
  ];

  return (
    <RecipientLayout title="Dashboard" subtitle="Your certificate overview">
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity ${DURATION.slow} ease, transform ${DURATION.slow} ease`,
      }}>
        <PageHeader
          title={`Welcome back, ${recipient?.name ?? ''}`}
          subtitle="Here's your certificate overview."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING.md, marginBottom: SPACING.xl }}>
          {STAT_CARDS.map(({ key, title, icon, color }) => (
            <StatCard
              key={key}
              title={title}
              value={stats[key]}
              icon={icon}
              color={color}
              loading={statsLoading}
            />
          ))}
        </div>

        <div style={{ backgroundColor: WHITE, borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`, boxShadow: SHADOW.sm, padding: SPACING.lg, marginBottom: SPACING.xl }}>
          <SectionHeading title="Recent Certificates" linkLabel="View All" linkTo="/recipient/certificates" navigate={navigate} />
          {certsLoading ? (
            <RowSkeleton />
          ) : recentCerts.length === 0 ? (
            <EmptyState icon={Award} title="No certificates yet" description="Certificates issued to you will appear here." />
          ) : (
            <Table
              columns={CERT_COLUMNS}
              data={recentCerts}
              total={recentCerts.length}
              page={1}
              limit={recentCerts.length}
              loading={false}
            />
          )}
        </div>

        <div style={{ backgroundColor: WHITE, borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`, boxShadow: SHADOW.sm, padding: SPACING.lg }}>
          <SectionHeading title="Recent Notifications" linkLabel="View All" linkTo="/recipient/notifications" navigate={navigate} />
          {notifsLoading ? (
            <RowSkeleton />
          ) : recentNotifs.length === 0 ? (
            <p style={{ fontSize: 13, color: MUTED, margin: 0, textAlign: 'center', padding: `${SPACING.lg}px 0` }}>No notifications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              {recentNotifs.map((notif) => (
                <NotificationItem
                  key={notif.notification_id}
                  notification={notif}
                  onRead={handleNotifRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RecipientLayout>
  );
}
